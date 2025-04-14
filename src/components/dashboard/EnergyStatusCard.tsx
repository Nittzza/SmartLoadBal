
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Zap } from "lucide-react";

interface EnergyStatusCardProps {
  currentUsage: number;
  thresholdKw: number;
  isAutoBalanceEnabled: boolean;
  onToggleAutoBalance: (enabled: boolean) => void;
}

const EnergyStatusCard: React.FC<EnergyStatusCardProps> = ({
  currentUsage,
  thresholdKw,
  isAutoBalanceEnabled,
  onToggleAutoBalance,
}) => {
  // Calculate percentage of current usage against threshold
  const usagePercentage = Math.min(Math.round((currentUsage / thresholdKw) * 100), 100);
  
  // Determine status based on usage percentage
  const getStatus = () => {
    if (usagePercentage < 70) return { label: "Normal", color: "text-energy-success", bg: "bg-energy-success" };
    if (usagePercentage < 90) return { label: "Moderate", color: "text-energy-warning", bg: "bg-energy-warning" };
    return { label: "Overload", color: "text-energy-critical", bg: "bg-energy-critical" };
  };

  const status = getStatus();

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Energy Status</CardTitle>
            <CardDescription>Current power consumption</CardDescription>
          </div>
          <Zap className="h-8 w-8 text-energy-blue" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <div className="text-4xl font-bold">{currentUsage.toFixed(1)} kW</div>
          <div className={`py-1 px-3 rounded-full ${status.bg}/20 ${status.color} text-sm font-medium`}>
            {status.label}
          </div>
        </div>
        <div className="space-y-2">
          <Progress value={usagePercentage} className="h-2" 
            style={{
              background: "rgba(0,0,0,0.1)",
              ["--progress-background" as any]: 
                usagePercentage < 70 ? "#10B981" : 
                usagePercentage < 90 ? "#F97316" : "#EF4444"
            }} 
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <div>0 kW</div>
            <div>Threshold: {thresholdKw} kW</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-1 border-t">
        <div className="flex items-center justify-between w-full pt-2">
          <Label htmlFor="auto-balance" className="cursor-pointer">Auto Load Balancer</Label>
          <Switch
            id="auto-balance"
            checked={isAutoBalanceEnabled}
            onCheckedChange={onToggleAutoBalance}
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default EnergyStatusCard;
