import { supabase } from './client';

// Define types for our database tables
type MaterialImpressao = {
  id: number;
  tipo: string;
  material: string;
  caracteristica: string;
  cor: string;
  media_m2_2024: number;
};

type Maquina = {
  id: string;
  maquina: string;
  valor_m2: number;
  integer_id: number;
};

/**
 * Fetch distinct material types (tipo) from materiais_impressao table
 */
export async function fetchMaterialTypes(): Promise<string[]> {
  const { data, error } = await supabase
    .from('materiais_impressao')
    .select('tipo')
    .order('tipo');
  
  if (error) {
    console.error('Error fetching material types:', error);
    throw error;
  }

  // Get unique values on the client side
  const uniqueTypes = [...new Set(data.map((item: { tipo: string }) => item.tipo))];
  return uniqueTypes;
}

/**
 * Fetch distinct materials by type from materiais_impressao table
 */
export async function fetchMaterialsByType(tipo: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('materiais_impressao')
    .select('material')
    .eq('tipo', tipo)
    .order('material');
  
  if (error) {
    console.error('Error fetching materials by type:', error);
    throw error;
  }

  // Get unique values on the client side
  const uniqueMaterials = [...new Set(data.map((item: { material: string }) => item.material))];
  return uniqueMaterials;
}

/**
 * Fetch distinct characteristics by type and material from materiais_impressao table
 */
export async function fetchCharacteristicsByTypeAndMaterial(
  tipo: string, 
  material: string
): Promise<string[]> {
  const { data, error } = await supabase
    .from('materiais_impressao')
    .select('caracteristica')
    .eq('tipo', tipo)
    .eq('material', material)
    .order('caracteristica');
  
  if (error) {
    console.error('Error fetching characteristics:', error);
    throw error;
  }

  // Get unique values on the client side
  const uniqueCharacteristics = [...new Set(data.map((item: { caracteristica: string }) => item.caracteristica))];
  return uniqueCharacteristics;
}

/**
 * Fetch distinct colors by type, material, and characteristic from materiais_impressao table
 */
export async function fetchColorsByTypeAndMaterialAndCharacteristic(
  tipo: string,
  material: string,
  caracteristica: string
): Promise<string[]> {
  const { data, error } = await supabase
    .from('materiais_impressao')
    .select('cor')
    .eq('tipo', tipo)
    .eq('material', material)
    .eq('caracteristica', caracteristica)
    .order('cor');
  
  if (error) {
    console.error('Error fetching colors:', error);
    throw error;
  }

  // Get unique values on the client side
  const uniqueColors = [...new Set(data.map((item: { cor: string }) => item.cor))];
  return uniqueColors;
}

/**
 * Fetch all machines from maquinas table
 */
export async function fetchMachines(): Promise<Maquina[]> {
  const { data, error } = await supabase
    .from('maquinas')
    .select('id, maquina, valor_m2, integer_id')
    .order('maquina');

  if (error) {
    console.error('Error fetching machines:', error);
    throw error;
  }

  return data as Maquina[];
}

/**
 * Fetch material price by selections
 */
export async function fetchMaterialPrice(
  tipo: string,
  material: string,
  caracteristica: string,
  cor: string
): Promise<{ id: number; price: number }> {
  const { data, error } = await supabase
    .from('materiais_impressao')
    .select('id, media_m2_2024')
    .eq('tipo', tipo)
    .eq('material', material)
    .eq('caracteristica', caracteristica)
    .eq('cor', cor)
    .single();

  if (error) {
    console.error('Error fetching material price:', error);
    throw error;
  }

  return {
    id: data.id,
    price: data.media_m2_2024
  };
}

/**
 * Fetch machine price by id
 */
export async function fetchMachinePrice(machineId: string | number): Promise<number> {
  const { data, error } = await supabase
    .from('maquinas')
    .select('valor_m2')
    .eq(typeof machineId === 'string' ? 'id' : 'integer_id', machineId)
    .single();

  if (error) {
    console.error('Error fetching machine price:', error);
    throw error;
  }

  return data.valor_m2;
}

// Define the type for calculation data
export type CalculationData = {
  material1_id?: number;
  material1_tipo?: string;
  material1_material?: string;
  material1_caracteristica?: string;
  material1_cor?: string;
  material1_valor_m2?: number;
  material2_id?: number;
  material2_tipo?: string;
  material2_material?: string;
  material2_caracteristica?: string;
  material2_cor?: string;
  material2_valor_m2?: number;
  material3_id?: number;
  material3_tipo?: string;
  material3_material?: string;
  material3_caracteristica?: string;
  material3_cor?: string;
  material3_valor_m2?: number;
  maquina_id?: number;
  maquina_nome?: string;
  maquina_valor_m2?: number;
  maquina_uuid?: string;
  metros_quadrados?: number;
  custo_total_materiais?: number;
  custo_total_maquina?: number;
  custo_liquido_total?: number;
  margem?: number;
  preco_final?: number;
  preco_atual?: number;
  diferenca_percentual?: number;
  notas?: string;
  calculation_id: string;
};

/**
 * Save calculation to calculo_materiais table
 */
export async function saveCalculation(calculationData: CalculationData) {
  console.log('Saving calculation data:', calculationData);
  
  try {
    const { data, error } = await supabase
      .from('calculo_materiais')
      .upsert(calculationData, { onConflict: 'calculation_id' }) // Use upsert to handle inserts and updates
      .select();

    if (error) {
      console.error('Error saving calculation:', error);
      throw error;
    }

    console.log('Calculation saved successfully:', data);
    return data[0];
  } catch (error) {
    console.error('Exception saving calculation:', error);
    throw error;
  }
}

/**
 * Load calculation by calculation_id
 */
export async function loadCalculation(calculationId: string): Promise<CalculationData> {
  console.log(`Attempting to load calculation with ID: ${calculationId}`);
  
  try {
    const { data, error } = await supabase
      .from('calculo_materiais')
      .select('*')
      .eq('calculation_id', calculationId)
      .single();

    if (error) {
      console.error('Error loading calculation:', error);
      throw error;
    }

    console.log('Calculation data loaded successfully:', data);
    return data as CalculationData;
  } catch (error) {
    console.error('Exception in loadCalculation:', error);
    throw error;
  }
}

/**
 * Generate a unique calculation ID
 */
export function generateCalculationId(): string {
  return `calc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Fetch all calculations for the price table
 */
export async function fetchAllCalculations(): Promise<any[]> { // Using any[] for now, refine later if needed
  console.log('Fetching all calculations from calculo_materiais table...');
  try {
    const { data, error } = await supabase
      .from('calculo_materiais')
      .select(`
        id,
        calculation_id,
        material1_tipo,
        material1_material,
        material1_caracteristica,
        material1_cor,
        material2_tipo,
        material2_material,
        material2_caracteristica,
        material2_cor,
        material3_tipo,
        material3_material,
        material3_caracteristica,
        material3_cor,
        maquina_nome,
        margem,
        custo_liquido_total,
        preco_atual,
        preco_final
      `)
      .order('id', { ascending: false }); // Example ordering, adjust if needed

    if (error) {
      console.error('Error fetching all calculations:', error);
      console.error('Error details:', error.message, error.details, error.hint);
      throw error;
    }

    console.log(`Successfully fetched ${data?.length || 0} calculations`);
    return data || [];
  } catch (exception) {
    console.error('Exception in fetchAllCalculations:', exception);
    throw exception;
  }
}
