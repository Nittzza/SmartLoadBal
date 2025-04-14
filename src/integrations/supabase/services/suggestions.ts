
import { supabase } from "@/integrations/supabase/client";

export async function fetchSuggestions() {
  const { data, error } = await supabase
    .from('suggestions')
    .select('*, appliances(name)')
    .eq('is_applied', false);
  
  if (error) {
    console.error('Error fetching suggestions:', error);
    throw error;
  }
  
  return data;
}

export async function applySuggestion(id: string) {
  const { data, error } = await supabase
    .from('suggestions')
    .update({ is_applied: true })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error applying suggestion:', error);
    throw error;
  }
  
  return data;
}
