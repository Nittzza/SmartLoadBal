
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Clock, Calendar, BarChart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchUsageLogs } from "@/integrations/supabase/services/usageLogs";

const TrafficManagement: React.FC = () => {
  // Fetch usage logs
  const { data: usageLogs = [], isLoading: isLoadingLogs } = useQuery({
    queryKey: ['usageLogs'],
    queryFn: fetchUsageLogs
  });

  // Mock pattern data (in a real app, we would detect patterns from the logs)
  const mockPatterns = [
    {
      id: "pattern-1",
      appliance: "Washing Machine",
      frequency: "Every Tuesday and Friday",
      timeRange: "9:00 AM - 10:30 AM",
      averagePower: "1.2 kWh",
      totalInstances: 8
    },
    {
      id: "pattern-2",
      appliance: "Air Conditioner",
      frequency: "Daily",
      timeRange: "2:00 PM - 6:00 PM",
      averagePower: "2.5 kWh",
      totalInstances: 14
    },
    {
      id: "pattern-3",
      appliance: "Water Heater",
      frequency: "Weekdays",
      timeRange: "7:30 AM - 8:15 AM",
      averagePower: "1.8 kWh",
      totalInstances: 10
    },
    {
      id: "pattern-4",
      appliance: "Television",
      frequency: "Daily",
      timeRange: "8:00 PM - 11:00 PM",
      averagePower: "0.4 kWh",
      totalInstances: 14
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Traffic Management</h1>
        </div>

        <Tabs defaultValue="patterns">
          <TabsList>
            <TabsTrigger value="patterns">
              <Activity className="h-4 w-4 mr-2" />
              Usage Patterns
            </TabsTrigger>
            <TabsTrigger value="logs">
              <Clock className="h-4 w-4 mr-2" />
              Usage Logs
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="patterns" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-energy-blue" />
                  Detected Usage Patterns
                </CardTitle>
                <CardDescription>
                  Recurring patterns detected in your appliance usage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 bg-muted/50 p-3 text-sm font-medium">
                    <div>Appliance</div>
                    <div>Frequency</div>
                    <div>Time</div>
                    <div>Avg. Power</div>
                    <div>Instances</div>
                  </div>
                  {mockPatterns.map((pattern) => (
                    <div 
                      key={pattern.id} 
                      className="grid grid-cols-5 p-3 text-sm border-t hover:bg-muted/20"
                    >
                      <div className="font-medium">{pattern.appliance}</div>
                      <div>{pattern.frequency}</div>
                      <div>{pattern.timeRange}</div>
                      <div>{pattern.averagePower}</div>
                      <div>{pattern.totalInstances}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="logs" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-energy-blue" />
                  Recent Usage Logs
                </CardTitle>
                <CardDescription>
                  Detailed logs of your appliance usage
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingLogs ? (
                  <div className="text-center py-8">
                    <p>Loading usage logs...</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <div className="grid grid-cols-5 bg-muted/50 p-3 text-sm font-medium">
                      <div>Appliance</div>
                      <div>Date</div>
                      <div>Start Time</div>
                      <div>End Time</div>
                      <div>Energy Used</div>
                    </div>
                    {usageLogs.map((log: any) => {
                      const startDate = new Date(log.start_time);
                      const endDate = log.end_time ? new Date(log.end_time) : null;
                      
                      return (
                        <div 
                          key={log.id} 
                          className="grid grid-cols-5 p-3 text-sm border-t hover:bg-muted/20"
                        >
                          <div className="font-medium">{log.appliances?.name || 'Unknown'}</div>
                          <div>{startDate.toLocaleDateString()}</div>
                          <div>{startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                          <div>{endDate ? endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</div>
                          <div>{log.energy_consumed ? `${log.energy_consumed} kWh` : '-'}</div>
                        </div>
                      );
                    })}
                    
                    {usageLogs.length === 0 && (
                      <div className="p-8 text-center text-muted-foreground">
                        <p>No usage logs available.</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TrafficManagement;
