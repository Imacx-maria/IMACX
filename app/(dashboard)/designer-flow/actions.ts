'use server';

import { createServerActionClient, SupabaseClient } from '@supabase/auth-helpers-nextjs'; // Import SupabaseClient
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

const DESIGNER_ROLE_ID = '3fd89b98-41bd-47e0-9f58-f59767c3090d';

// Define return type for getDesigners
export type DesignerInfo = { id: string; first_name: string | null };

export async function getDesigners(): Promise<DesignerInfo[]> {
  const cookieStore = cookies();
  const supabase = createServerActionClient<Database>({ 
    cookies: async () => cookieStore 
  });

  try {
    const { data: designers, error } = await supabase
      .from('profiles')
      .select('id, first_name')
      .eq('role_id', DESIGNER_ROLE_ID)
      .order('first_name', { ascending: true });

    if (error) {
      console.error('Error fetching designers:', error);
      throw new Error(`Failed to fetch designers: ${error.message}`);
    }

    // Ensure first_name is handled correctly if it can be null
    return designers?.map(d => ({ id: d.id, first_name: d.first_name ?? 'Unnamed' })) ?? [];

  } catch (error) {
    console.error('Unexpected error in getDesigners:', error);
    // Depending on requirements, you might return an empty array or re-throw
    return [];
  }
}

// Temporarily commented out getWorkOrders function block to isolate TS errors

// Type definition for the structure returned by getWorkOrders
export type WorkOrderWithDetails = Database['public']['Tables']['folhas_obras']['Row'] & {
  profiles: { first_name: string | null } | null; // Designer profile
  items: Pick<Database['public']['Tables']['items']['Row'], 'id' | 'paginacao'>[]; // Only needed fields for count/status
  completion_percentage: number;
};
export type WorkOrderList = WorkOrderWithDetails[]; // Define alias for the array type

// Type definition for filters (to be expanded)
export type WorkOrderFilters = {
  status?: 'open' | 'closed';
  designerId?: string;
  foNumber?: string;
  itemDescription?: string;
};
export async function getWorkOrders(
  filters: WorkOrderFilters = {}
): Promise<WorkOrderList> { // Use the type alias
  const cookieStore = cookies();
  // Explicitly type the supabase client with Database generic
  const supabase = createServerActionClient<Database>({ 
    cookies: async () => cookieStore 
  });

  try {
    // Base query to fetch work orders and related designer profile
    let query = supabase
      .from('folhas_obras')
      .select(`
        *,
        profiles ( first_name ),
        items ( id, paginacao )
      `)
      // Default sorting
      .order('prioridade', { ascending: false })
      .order('data_in', { ascending: false });

    // TODO: Apply filters based on the 'filters' object
    // Example: if (filters.status === 'open') query = query.is('data_saida', null);
    // Example: if (filters.designerId) query = query.eq('profile_id', filters.designerId);

    const { data: workOrders, error } = await query;

    if (error) {
      console.error('Error fetching work orders:', error);
      throw new Error(`Failed to fetch work orders: ${error.message}`);
    }

    if (!workOrders) {
        return [];
    }

    // Calculate completion percentage for each work order
    // Add explicit type for 'wo' parameter
    const workOrdersWithDetails = workOrders.map((wo: any) => { // Using 'any' for now, ideally derive from query result type
      const totalItems = wo.items?.length ?? 0;
      // Add explicit type for 'item' parameter
      const completedItems = wo.items?.filter((item: any) => item.paginacao).length ?? 0; // Using 'any' for now
      const completion_percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

      // Ensure profile structure matches expected type, even if null
      const profileData = wo.profiles ? { first_name: wo.profiles.first_name } : null;

      return {
        ...wo,
        profiles: profileData, // Assign potentially null profile
        items: wo.items ?? [], // Ensure items is always an array
        completion_percentage,
      };
    });

    return workOrdersWithDetails;

  } catch (error) {
    console.error('Unexpected error in getWorkOrders:', error);
    return [];
  }
}

// Helper function to check FO number uniqueness
async function checkFoUniqueness(supabase: SupabaseClient<Database>, numero_fo: number, currentId?: string): Promise<boolean> {
  let query = supabase
    .from('folhas_obras')
    .select('id')
    .eq('numero_fo', numero_fo)
    .limit(1);

  // If checking during an update, exclude the current record ID
  if (currentId) {
    query = query.neq('id', currentId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error checking FO uniqueness:', error);
    // Fail safe - assume not unique if check fails
    return false;
  }

  // If data is found (and not empty), it means the number is already used
  return data === null || data.length === 0;
}

// Type for data needed to create a work order
export type CreateWorkOrderData = {
  numero_fo: number;
  nome_campanha: string;
  notas?: string;
  // Initial items to create along with the work order
  items: Array<Pick<Database['public']['Tables']['items']['Row'], 'descricao' | 'codigo'>>;
};

export async function createWorkOrder(
  formData: CreateWorkOrderData
): Promise<{ success: boolean; message: string; data?: Database['public']['Tables']['folhas_obras']['Row'] }> {
  const cookieStore = cookies();
  const supabase = createServerActionClient<Database>({ 
    cookies: async () => cookieStore 
  });

  // --- Validation ---
  if (!formData.numero_fo || formData.numero_fo < 0 || formData.numero_fo > 9999) {
    return { success: false, message: 'Invalid FO Number (must be 0-9999).' };
  }
  if (!formData.nome_campanha) {
    return { success: false, message: 'Campaign Name is required.' };
  }
  if (!formData.items || formData.items.length === 0) {
      return { success: false, message: 'At least one item is required.' };
  }
  // Check uniqueness
  const isUnique = await checkFoUniqueness(supabase, formData.numero_fo);
  if (!isUnique) {
    return { success: false, message: `FO Number ${formData.numero_fo} already exists.` };
  }

  // --- Database Operation ---
  try {
    // 1. Insert the main work order
    const { data: newWorkOrder, error: workOrderError } = await supabase
      .from('folhas_obras')
      .insert({
        numero_fo: formData.numero_fo,
        nome_campanha: formData.nome_campanha,
        notas: formData.notas,
        // profile_id, prioridade, data_in will use DB defaults or be set later
      })
      .select()
      .single(); // Use single() to get the inserted row back

    if (workOrderError || !newWorkOrder) {
      console.error('Error creating work order:', workOrderError);
      throw new Error(workOrderError?.message || 'Failed to create work order record.');
    }

    // 2. Prepare and insert the associated items
    const itemsToInsert = formData.items.map(item => ({
      folha_obra_id: newWorkOrder.id, // Link to the newly created work order
      descricao: item.descricao,
      codigo: item.codigo,
      // em_curso and data_in will use DB defaults
    }));

    const { error: itemsError } = await supabase
      .from('items')
      .insert(itemsToInsert);

    if (itemsError) {
      console.error('Error creating items for work order:', itemsError);
      // Attempt to rollback? Or notify user? For now, throw error.
      // Consider deleting the created folha_obra if items fail? Transaction needed ideally.
      throw new Error(itemsError.message || 'Failed to create items for the work order.');
    }

    return { success: true, message: 'Work order created successfully.', data: newWorkOrder };

  } catch (error: any) {
    console.error('Unexpected error in createWorkOrder:', error);
    return { success: false, message: error.message || 'An unexpected error occurred.' };
  }
}

// Type for data needed to update a work order's main fields
export type UpdateWorkOrderData = {
  id: string; // ID of the work order to update
  profile_id?: string | null; // Optional: new designer ID (or null to unassign)
  nome_campanha?: string; // Optional: new campaign name
  notas?: string | null; // Optional: new notes
  prioridade?: boolean; // Optional: new priority status
};

export async function updateWorkOrder(
  formData: UpdateWorkOrderData
): Promise<{ success: boolean; message: string }> {
  const cookieStore = cookies();
  const supabase = createServerActionClient<Database>({ 
    cookies: async () => cookieStore 
  });

  const { id, ...updateData } = formData;

  // --- Validation ---
  if (!id) {
    return { success: false, message: 'Work Order ID is required for update.' };
  }
  if (Object.keys(updateData).length === 0) {
    return { success: false, message: 'No update data provided.' };
  }
  // Basic validation for campaign name if provided
  if (updateData.nome_campanha !== undefined && !updateData.nome_campanha) {
      return { success: false, message: 'Campaign Name cannot be empty.' };
  }
  // Note: FO Number uniqueness check is omitted here as it's typically not updated directly.
  // If FO number update is needed, add uniqueness check similar to createWorkOrder.

  // --- Database Operation ---
  try {
    const { error } = await supabase
      .from('folhas_obras')
      .update(updateData) // Pass only the fields to be updated
      .eq('id', id);

    if (error) {
      console.error('Error updating work order:', error);
      throw new Error(error.message || 'Failed to update work order.');
    }

    return { success: true, message: 'Work order updated successfully.' };

  } catch (error: any) {
    console.error('Unexpected error in updateWorkOrder:', error);
    return { success: false, message: error.message || 'An unexpected error occurred.' };
  }
}

// Type for a single item being submitted (could be new or existing)
export type ItemFormData = {
  id?: string; // Present for existing items, undefined for new ones
  descricao: string;
  codigo?: string | null;
  em_curso?: boolean | null;
  duvidas?: boolean | null;
  maquete_enviada?: boolean | null;
  paginacao?: boolean | null;
  path_trabalho?: string | null;
  // Dates are generally set by logic, not directly submitted
};

// Type for the main update function input
export type UpdateWorkOrderItemsData = {
  folha_obra_id: string;
  items: ItemFormData[];
};

export async function updateWorkOrderItems(
  formData: UpdateWorkOrderItemsData
): Promise<{ success: boolean; message: string }> {
  const cookieStore = cookies();
  const supabase = createServerActionClient<Database>({ 
    cookies: async () => cookieStore 
  });

  // — Validation —
  if (!formData.folha_obra_id) {
    return { success: false, message: 'Work Order ID is required.' };
  }
  if (!formData.items || formData.items.length === 0) {
    return { success: false, message: 'No items provided for update.' };
  }

  // — Database Operations —
  try {
    // Group items into existing (to update) and new (to insert)
    const existingItems = formData.items.filter(item => item.id);
    const newItems = formData.items.filter(item => !item.id);

    // Process existing items (updates)
    if (existingItems.length > 0) {
      // First, fetch the current state of these items to compare changes
      const existingItemIds = existingItems
        .map(item => item.id)
        .filter((id): id is string => !!id); // Filter out undefined and ensure string type
      
      const { data: currentItems, error: fetchError } = await supabase
        .from('items')
        .select('*')
        .in('id', existingItemIds);

      if (fetchError) {
        console.error('Error fetching current items:', fetchError);
        throw new Error(fetchError.message);
      }

      // Create a map for easier access
      const currentItemsMap = new Map(
        currentItems?.map(item => [item.id, item]) || []
      );

      // Process each item update with proper date handling
      const updatePromises = existingItems.map(async (item) => {
        const currentItem = currentItemsMap.get(item.id as string);
        
        if (!currentItem) {
          console.warn(`Item ${item.id} not found in database, skipping update.`);
          return { success: true }; // Skip this item but don't fail the whole operation
        }

        if (!item.id) {
          console.warn(`Item missing ID, skipping update.`);
          return { success: true }; // Skip this item but don't fail the whole operation
        }

        // Prepare update data with proper date handling
        const updateData: any = {
          descricao: item.descricao,
          codigo: item.codigo,
          em_curso: item.em_curso,
          duvidas: item.duvidas,
          maquete_enviada: item.maquete_enviada,
          paginacao: item.paginacao,
          path_trabalho: item.path_trabalho,
        };

        // Set dates based on checkbox changes
        
        // Em Curso - Don't need to set data_in again if it was already in progress
        
        // Dúvidas - If newly set to true, add current date
        if (item.duvidas && !currentItem.duvidas) {
          updateData.data_duvidas = new Date().toISOString();
          // When duvidas becomes true, em_curso should be set to false
          updateData.em_curso = false;
        }
        
        // Maquete Enviada - If newly set to true, add current date
        if (item.maquete_enviada && !currentItem.maquete_enviada) {
          updateData.data_envio = new Date().toISOString();
        }
        
        // Paginação - If newly set to true, add current date
        if (item.paginacao && !currentItem.paginacao) {
          updateData.data_saida = new Date().toISOString();
          
          // Path is required when paginacao is true
          if (!item.path_trabalho) {
            return { 
              success: false,
              message: `Path is required for item "${item.descricao}" when marking as completed.`
            };
          }
        }

        // Perform the update
        const { error: updateError } = await supabase
          .from('items')
          .update(updateData)
          .eq('id', item.id);

        if (updateError) {
          console.error(`Error updating item ${item.id}:`, updateError);
          return { success: false, message: updateError.message };
        }

        return { success: true };
      });

      // Wait for all updates to complete
      const updateResults = await Promise.all(updatePromises);
      
      // Check if any updates failed
      const failedUpdates = updateResults.filter(result => !result.success);
      if (failedUpdates.length > 0) {
        return { 
          success: false, 
          message: `Failed to update ${failedUpdates.length} items: ${failedUpdates[0].message}`
        };
      }
    }

    // Process new items (inserts)
    if (newItems.length > 0) {
      const itemsToInsert = newItems.map(item => ({
        folha_obra_id: formData.folha_obra_id,
        descricao: item.descricao,
        codigo: item.codigo,
        em_curso: item.em_curso ?? true, // Default to true for new items
        duvidas: item.duvidas ?? false,
        maquete_enviada: item.maquete_enviada ?? false,
        paginacao: item.paginacao ?? false,
        path_trabalho: item.path_trabalho,
        // Dates will be handled by the database defaults and triggers
      }));

      const { error: insertError } = await supabase
        .from('items')
        .insert(itemsToInsert);

      if (insertError) {
        console.error('Error inserting new items:', insertError);
        return { success: false, message: `Failed to add new items: ${insertError.message}` };
      }
    }

    return { success: true, message: 'Work order items updated successfully.' };

  } catch (error: any) {
    console.error('Unexpected error in updateWorkOrderItems:', error);
    return { success: false, message: error.message || 'An unexpected error occurred while updating items.' };
  }
}

export async function deleteWorkOrder(
  id: string
): Promise<{ success: boolean; message: string }> {
  if (!id) {
    return { success: false, message: 'Work Order ID is required for deletion.' };
  }

  const cookieStore = cookies();
  const supabase = createServerActionClient<Database>({ 
    cookies: async () => cookieStore 
  });

  try {
    const { error } = await supabase
      .from('folhas_obras')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting work order:', error);
      throw new Error(error.message || 'Failed to delete work order.');
    }

    // Note: Associated items should be deleted automatically due to ON DELETE CASCADE constraint
    return { success: true, message: 'Work order deleted successfully.' };

  } catch (error: any) {
    console.error('Unexpected error in deleteWorkOrder:', error);
    return { success: false, message: error.message || 'An unexpected error occurred.' };
  }
}

export async function deleteItem(
  id: string
): Promise<{ success: boolean; message: string }> {
  if (!id) {
    return { success: false, message: 'Item ID is required for deletion.' };
  }

  const cookieStore = cookies();
  const supabase = createServerActionClient<Database>({ 
    cookies: async () => cookieStore 
  });

  try {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting item:', error);
      throw new Error(error.message || 'Failed to delete item.');
    }

    // Note: Need to consider if deleting an item should update the parent work order's completion status.
    // The database trigger `handle_item_deletion` mentioned in db-documentation_designer_flow.md should handle this.
    return { success: true, message: 'Item deleted successfully.' };

  } catch (error: any) {
    console.error('Unexpected error in deleteItem:', error);
    return { success: false, message: error.message || 'An unexpected error occurred.' };
  }
}

// Function to get a single work order with complete item details
export async function getWorkOrderWithFullDetails(
  id: string
): Promise<{ success: boolean; message: string; data?: WorkOrderForEditing }> {
  const cookieStore = cookies();
  const supabase = createServerActionClient<Database>({ 
    cookies: async () => cookieStore 
  });

  try {
    // Fetch the work order
    const { data: workOrder, error: workOrderError } = await supabase
      .from('folhas_obras')
      .select(`
        *,
        profiles ( first_name )
      `)
      .eq('id', id)
      .single();

    if (workOrderError) {
      console.error('Error fetching work order:', workOrderError);
      throw new Error(workOrderError.message);
    }

    if (!workOrder) {
      return { success: false, message: 'Work order not found.' };
    }

    // Fetch complete items for this work order
    const { data: items, error: itemsError } = await supabase
      .from('items')
      .select(`
        id,
        descricao,
        codigo,
        em_curso,
        duvidas,
        maquete_enviada,
        paginacao,
        path_trabalho
      `)
      .eq('folha_obra_id', id);

    if (itemsError) {
      console.error('Error fetching items:', itemsError);
      throw new Error(itemsError.message);
    }

    // Create the result with full item details
    const result: WorkOrderForEditing = {
      id: workOrder.id,
      numero_fo: workOrder.numero_fo,
      nome_campanha: workOrder.nome_campanha ?? '',
      notas: workOrder.notas ?? '',
      items: items ? items.map(item => ({
        id: item.id,
        descricao: item.descricao,
        codigo: item.codigo,
        em_curso: Boolean(item.em_curso),
        duvidas: Boolean(item.duvidas),
        maquete_enviada: Boolean(item.maquete_enviada),
        paginacao: Boolean(item.paginacao),
        path_trabalho: item.path_trabalho,
      })) : [],
      // Add other fields as needed
    };

    return { success: true, message: 'Work order fetched successfully.', data: result };

  } catch (error: any) {
    console.error('Unexpected error in getWorkOrderWithFullDetails:', error);
    return { success: false, message: error.message || 'An unexpected error occurred.' };
  }
}

// Type specifically for editing work orders
export type WorkOrderForEditing = {
  id: string;
  numero_fo: number;
  nome_campanha: string;
  notas: string;
  items: Array<{
    id: string;
    descricao: string;
    codigo: string | null;
    em_curso: boolean;
    duvidas: boolean;
    maquete_enviada: boolean;
    paginacao: boolean;
    path_trabalho?: string | null;
  }>;
};