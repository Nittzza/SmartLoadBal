
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tv, Coffee, Fan, Refrigerator, ServerCog, WashingMachine } from "lucide-react";

// Demo appliance data
export interface Appliance {
  id: string;
  name: string;
  icon: string; // Changed from React.ElementType to string
  currentWattage: number;
  isOn: boolean;
  isCritical: boolean;
  priority: 'High' | 'Medium' | 'Low';
}

interface AppliancesListProps {
  appliances: Appliance[];
  onToggleAppliance: (id: string, isOn: boolean) => void;
}

// Map of icon strings to Lucide components
export const iconMapping: Record<string, React.ElementType> = {
  "tv": Tv,
  "coffee": Coffee,
  "fan": Fan,
  "refrigerator": Refrigerator,
  "server": ServerCog,
  "washing-machine": WashingMachine,
};

const priorityColors = {
  High: "bg-blue-100 text-blue-800",
  Medium: "bg-amber-100 text-amber-800",
  Low: "bg-slate-100 text-slate-800"
};

const AppliancesList: React.FC<AppliancesListProps> = ({
  appliances,
  onToggleAppliance,
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Active Appliances</CardTitle>
        <CardDescription>Currently running devices and their power consumption</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appliances.map((appliance) => (
            <div key={appliance.id} className="flex items-center justify-between p-3 bg-card rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="flex justify-center items-center h-10 w-10 rounded-md bg-primary/10">
                  {React.createElement(iconMapping[appliance.icon] || ServerCog, { className: "h-5 w-5 text-primary" })}
                </div>
                <div>
                  <div className="font-medium">{appliance.name}</div>
                  <div className="text-sm text-muted-foreground">{appliance.currentWattage} W</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="outline" className={`text-xs ${priorityColors[appliance.priority]}`}>
                    {appliance.priority}
                  </Badge>
                  {appliance.isCritical && (
                    <Badge variant="outline" className="bg-red-100 text-red-800 text-xs">
                      Critical
                    </Badge>
                  )}
                </div>
                <Switch 
                  checked={appliance.isOn} 
                  onCheckedChange={(checked) => onToggleAppliance(appliance.id, checked)}
                  disabled={appliance.isCritical}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppliancesList;
