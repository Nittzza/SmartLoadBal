
import { supabase } from "@/integrations/supabase/client";

export async function fetchUsageLogs() {
  const { data, error } = await supabase
    .from('usage_logs')
    .select('*, appliances(name, icon)')
    .order('start_time', { ascending: false })
    .limit(20);
  
  if (error) {
    console.error('Error fetching usage logs:', error);
    throw error;
  }
  
  return data;
}

export async function createUsageLog(log: {
  appliance_id: string;
  start_time: string;
  end_time?: string | null;
  energy_consumed?: number | null;
}) {
  const { data, error } = await supabase
    .from('usage_logs')
    .insert(log)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating usage log:', error);
    throw error;
  }
  
  return data;
}
