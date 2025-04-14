
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Clock, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSuggestions, applySuggestion } from "@/integrations/supabase/services/suggestions";
import { fetchTariffs } from "@/integrations/supabase/services/tariffs";

const SmartSuggestions: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch suggestions
  const { data: suggestions = [] } = useQuery({
    queryKey: ['suggestions'],
    queryFn: fetchSuggestions
  });

  // Fetch tariffs
  const { data: tariffs = [] } = useQuery({
    queryKey: ['tariffs'],
    queryFn: fetchTariffs
  });

  // Format tariff data for display
  const tariffDisplay = {
    peak: {
      hours: tariffs.filter(t => t.name === 'Peak')
        .map(t => `${t.start_time.slice(0, 5)} - ${t.end_time.slice(0, 5)}`)
        .join(', '),
      rate: tariffs.find(t => t.name === 'Peak')?.rate || 0
    },
    shoulder: {
      hours: tariffs.filter(t => t.name === 'Shoulder')
        .map(t => `${t.start_time.slice(0, 5)} - ${t.end_time.slice(0, 5)}`)
        .join(', '),
      rate: tariffs.find(t => t.name === 'Shoulder')?.rate || 0
    },
    offPeak: {
      hours: tariffs.filter(t => t.name === 'Off-Peak')
        .map(t => `${t.start_time.slice(0, 5)} - ${t.end_time.slice(0, 5)}`)
        .join(', '),
      rate: tariffs.find(t => t.name === 'Off-Peak')?.rate || 0
    }
  };

  // Apply suggestion mutation
  const applySuggestionMutation = useMutation({
    mutationFn: (suggestionId: string) => applySuggestion(suggestionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestions'] });
    }
  });

  const handleApprove = (suggestionId: string, appliance: string) => {
    applySuggestionMutation.mutate(suggestionId);
    
    toast({
      title: "Schedule updated",
      description: `${appliance} has been rescheduled to save energy costs.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-energy-blue" />
          Smart Suggestions
        </CardTitle>
        <CardDescription>
          Cost-saving opportunities based on your usage patterns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Tariff information */}
          <div className="mb-6 bg-muted/30 p-3 rounded-md">
            <h4 className="font-medium mb-2">Current Time-of-Use Tariffs:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
              <div className="p-2 bg-red-100 rounded">
                <span className="font-medium">Peak:</span> {tariffDisplay.peak.hours}
                <div>₹{tariffDisplay.peak.rate.toFixed(2)} per kWh</div>
              </div>
              <div className="p-2 bg-amber-100 rounded">
                <span className="font-medium">Shoulder:</span> {tariffDisplay.shoulder.hours}
                <div>₹{tariffDisplay.shoulder.rate.toFixed(2)} per kWh</div>
              </div>
              <div className="p-2 bg-green-100 rounded">
                <span className="font-medium">Off-Peak:</span> {tariffDisplay.offPeak.hours}
                <div>₹{tariffDisplay.offPeak.rate.toFixed(2)} per kWh</div>
              </div>
            </div>
          </div>

          {/* If no suggestions */}
          {suggestions.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <Clock className="mx-auto h-10 w-10 mb-2 opacity-50" />
              <p>No suggestions available at the moment.</p>
              <p className="text-sm">We'll analyze your usage patterns and show cost-saving opportunities here.</p>
            </div>
          )}

          {/* Suggestions */}
          {suggestions.map((suggestion) => (
            <div 
              key={suggestion.id} 
              className="flex flex-col md:flex-row md:items-center justify-between border-b last:border-0 pb-4 last:pb-0"
            >
              <div className="flex-1">
                <p className="font-medium">
                  {suggestion.appliances?.name || 'Appliance'}
                </p>
                <p className="text-sm text-muted-foreground">
                  You usually run your {(suggestion.appliances?.name || 'appliance').toLowerCase()} at {suggestion.usual_time}.
                  Shifting this to {suggestion.suggested_time} could save <span className="font-medium text-green-600">₹{suggestion.potential_savings}</span> this week.
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Based on your usage over the past 2 weeks</span>
                </div>
              </div>
              <Button 
                onClick={() => handleApprove(suggestion.id, suggestion.appliances?.name || 'Appliance')}
                size="sm"
                className="mt-2 md:mt-0 bg-energy-blue hover:bg-energy-blue/90"
              >
                <Check className="mr-1 h-4 w-4" /> Apply
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartSuggestions;
