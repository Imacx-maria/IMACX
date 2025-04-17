import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing Supabase environment variables! Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env file.'
  );

  // In development, provide more helpful error message
  if (process.env.NODE_ENV === 'development') {
    console.error('Current environment variables:', {
      url: supabaseUrl || 'NOT SET',
      key: supabaseAnonKey ? 'IS SET (but value hidden)' : 'NOT SET'
    });
  }
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Removed unnecessary connection test block
// Create a function to get the service role client (for admin operations)
export const getServiceRoleClient = () => {
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, supabaseServiceRoleKey);
};

// Helper functions for common Supabase operations

/**
 * Fetch data from a table with optional filters
 */
export async function fetchData<T>(
  table: string,
  options?: {
    columns?: string;
    filters?: Record<string, any>;
    limit?: number;
    order?: { column: string; ascending?: boolean };
  }
) {
  let query = supabase.from(table).select(options?.columns || '*');

  // Apply filters if provided
  if (options?.filters) {
    Object.entries(options.filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
  }

  // Apply ordering if provided
  if (options?.order) {
    const { column, ascending = true } = options.order;
    query = query.order(column, { ascending });
  }

  // Apply limit if provided
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching data:', error);
    throw error;
  }

  return data as T[];
}

/**
 * Insert data into a table
 */
export async function insertData<T>(
  table: string,
  data: Record<string, any>
) {
  const { data: result, error } = await supabase
    .from(table)
    .insert(data)
    .select();

  if (error) {
    console.error('Error inserting data:', error);
    throw error;
  }

  return result as T[];
}

/**
 * Update data in a table
 */
export async function updateData<T>(
  table: string,
  id: string | number,
  data: Record<string, any>,
  idColumn: string = 'id'
) {
  const { data: result, error } = await supabase
    .from(table)
    .update(data)
    .eq(idColumn, id)
    .select();

  if (error) {
    console.error('Error updating data:', error);
    throw error;
  }

  return result as T[];
}

/**
 * Delete data from a table
 */
export async function deleteData(
  table: string,
  id: string | number,
  idColumn: string = 'id'
) {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq(idColumn, id);

  if (error) {
    console.error('Error deleting data:', error);
    throw error;
  }

  return true;
}

/**
 * Upload a file to storage
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File
) {
  const { data, error } = await supabase
    .storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    console.error('Error uploading file:', error);
    throw error;
  }

  return data;
}

/**
 * Get a public URL for a file
 */
export function getPublicUrl(
  bucket: string,
  path: string
) {
  const { data } = supabase
    .storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
}