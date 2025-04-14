
import { supabase } from "@/integrations/supabase/client";

export async function fetchAppliances() {
  const { data, error } = await supabase
    .from('appliances')
    .select('*');
  
  if (error) {
    console.error('Error fetching appliances:', error);
    throw error;
  }
  
  return data;
}

export async function toggleApplianceStatus(id: string, isOn: boolean) {
  // In a real application, we would update the status in a dedicated column
  // For this demo, we'll just log the action as we don't have a status column yet
  console.log(`Toggling appliance ${id} to ${isOn ? 'on' : 'off'}`);
  return { id, isOn };
}

export async function createAppliance(appliance: {
  name: string;
  icon: string;
  max_wattage: number;
  is_critical: boolean;
  priority: 'High' | 'Medium' | 'Low';
}) {
  const { data, error } = await supabase
    .from('appliances')
    .insert(appliance)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating appliance:', error);
    throw error;
  }
  
  return data;
}

export async function updateAppliance(
  id: string,
  updates: {
    name?: string;
    max_wattage?: number;
    is_critical?: boolean;
    priority?: 'High' | 'Medium' | 'Low';
  }
) {
  const { data, error } = await supabase
    .from('appliances')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating appliance:', error);
    throw error;
  }
  
  return data;
}

export async function deleteAppliance(id: string) {
  const { error } = await supabase
    .from('appliances')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting appliance:', error);
    throw error;
  }
  
  return true;
}
