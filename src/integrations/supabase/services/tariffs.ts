
import { supabase } from "@/integrations/supabase/client";

export async function fetchTariffs() {
  const { data, error } = await supabase
    .from('tariffs')
    .select('*')
    .order('rate', { ascending: false });
  
  if (error) {
    console.error('Error fetching tariffs:', error);
    throw error;
  }
  
  return data;
}
