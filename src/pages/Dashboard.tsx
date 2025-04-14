import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import EnergyStatusCard from "@/components/dashboard/EnergyStatusCard";
import AppliancesList from "@/components/dashboard/AppliancesList";
import EnergyUsageChart from "@/components/dashboard/EnergyUsageChart";
import SmartSuggestions from "@/components/dashboard/SmartSuggestions";
import { mockSettings } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { fetchAppliances, toggleApplianceStatus } from "@/integrations/supabase/services/appliances";
import { toast } from "@/hooks/use-toast";
import { iconMapping, Appliance } from "@/components/dashboard/AppliancesList";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [autoBalanceEnabled, setAutoBalanceEnabled] = useState(mockSettings.autoBalanceEnabled);
  
  const { data: appliances = [], isLoading } = useQuery({
    queryKey: ['appliances'],
    queryFn: fetchAppliances
  });
  
  const [applianceStatus, setApplianceStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (appliances.length > 0) {
      const initialStatus: Record<string, boolean> = {};
      appliances.forEach(app => {
        initialStatus[app.id] = Math.random() > 0.5;
      });
      setApplianceStatus(initialStatus);
    }
  }, [appliances]);

  const transformAppliancesToUI = (dbAppliances) => {
    return dbAppliances.map(app => ({
      id: app.id,
      name: app.name,
      icon: app.icon || 'server',
      currentWattage: app.max_wattage || 0,
      isOn: true,
      isCritical: app.is_critical,
      priority: app.priority
    }));
  };

  const toggleApplianceMutation = useMutation({
    mutationFn: ({ id, isOn }: { id: string; isOn: boolean }) => toggleApplianceStatus(id, isOn),
    onSuccess: (result) => {
      setApplianceStatus(prev => ({
        ...prev,
        [result.id]: result.isOn
      }));
      queryClient.invalidateQueries({ queryKey: ['appliances'] });
      toast({
        title: `Appliance ${result.isOn ? 'turned on' : 'turned off'}`,
        description: `The appliance has been ${result.isOn ? 'turned on' : 'turned off'} successfully.`,
      });
    }
  });

  const handleToggleAppliance = (id: string, isOn: boolean) => {
    toggleApplianceMutation.mutate({ id, isOn });
  };

  const currentUsage = appliances
    .filter(app => applianceStatus[app.id])
    .reduce((sum, app) => sum + (app.max_wattage || 0), 0) / 1000;

  const handleToggleAutoBalance = (enabled: boolean) => {
    setAutoBalanceEnabled(enabled);
    
    if (enabled) {
      const priorityOrder: Record<string, number> = { Low: 0, Medium: 1, High: 2 };
      
      let updatedStatus = { ...applianceStatus };
      let currentUsageKw = appliances
        .filter(app => updatedStatus[app.id])
        .reduce((sum, app) => sum + (app.max_wattage || 0), 0) / 1000;
      
      if (currentUsageKw > mockSettings.maxThresholdKw) {
        const sortedAppliances = appliances
          .filter(app => !app.is_critical && updatedStatus[app.id])
          .sort((a, b) => priorityOrder[a.priority as 'Low' | 'Medium' | 'High'] - priorityOrder[b.priority as 'Low' | 'Medium' | 'High']);
        
        for (const app of sortedAppliances) {
          if (currentUsageKw <= mockSettings.maxThresholdKw) break;
          
          updatedStatus[app.id] = false;
          toggleApplianceMutation.mutate({ id: app.id, isOn: false });
          
          currentUsageKw -= (app.max_wattage || 0) / 1000;
        }
        
        setApplianceStatus(updatedStatus);
        
        toast({
          title: "Auto-balance activated",
          description: "Some appliances have been turned off to stay within energy limits.",
        });
      }
    }
  };

  const onAppliances = appliances
    .filter(app => applianceStatus[app.id])
    .map(app => ({
      id: app.id,
      name: app.name,
      icon: app.icon,
      currentWattage: app.max_wattage || 0,
      isOn: applianceStatus[app.id] || false,
      isCritical: app.is_critical,
      priority: app.priority as 'High' | 'Medium' | 'Low'
    }));

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-medium mb-2">Loading dashboard...</h2>
            <p className="text-muted-foreground">Please wait while we fetch your appliance data.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={() => navigate("/appliances")} className="bg-energy-blue hover:bg-energy-blue/90">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Appliance
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <EnergyStatusCard
              currentUsage={currentUsage}
              thresholdKw={mockSettings.maxThresholdKw}
              isAutoBalanceEnabled={autoBalanceEnabled}
              onToggleAutoBalance={handleToggleAutoBalance}
            />
          </div>
          <div className="md:col-span-2">
            <EnergyUsageChart />
          </div>
        </div>

        <SmartSuggestions />

        <AppliancesList 
          appliances={onAppliances} 
          onToggleAppliance={handleToggleAppliance}
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
