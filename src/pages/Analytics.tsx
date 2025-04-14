
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockAppliances } from "@/data/mockData";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Demo data for energy usage over time
const dailyData = [
  { time: "00:00", usage: 1.2 },
  { time: "04:00", usage: 0.8 },
  { time: "08:00", usage: 2.1 },
  { time: "12:00", usage: 2.3 },
  { time: "16:00", usage: 2.6 },
  { time: "20:00", usage: 2.0 },
];

const weeklyData = [
  { time: "Mon", usage: 22.5 },
  { time: "Tue", usage: 21.3 },
  { time: "Wed", usage: 25.2 },
  { time: "Thu", usage: 24.1 },
  { time: "Fri", usage: 26.8 },
  { time: "Sat", usage: 30.5 },
  { time: "Sun", usage: 28.9 },
];

const monthlyData = [
  { time: "Week 1", usage: 175.2 },
  { time: "Week 2", usage: 182.3 },
  { time: "Week 3", usage: 168.7 },
  { time: "Week 4", usage: 180.5 },
];

// Colors for pie chart
const COLORS = ["#0EA5E9", "#6366F1", "#10B981", "#F97316", "#EF4444", "#8B5CF6"];

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly">("daily");

  // Prepare pie chart data
  const pieData = mockAppliances
    .filter(app => app.isOn)
    .map(app => ({
      name: app.name,
      value: app.currentWattage
    }));

  // Get current data based on selected time range
  const getTimeRangeData = () => {
    switch (timeRange) {
      case "daily":
        return dailyData;
      case "weekly":
        return weeklyData;
      case "monthly":
        return monthlyData;
      default:
        return dailyData;
    }
  };

  // Format label for the time range
  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case "daily":
        return "Last 24 Hours";
      case "weekly":
        return "Last 7 Days";
      case "monthly":
        return "Last Month";
      default:
        return "Energy Usage";
    }
  };

  // Format units based on time range
  const getUnitLabel = () => {
    switch (timeRange) {
      case "daily":
        return "kW";
      case "weekly":
      case "monthly":
        return "kWh";
      default:
        return "kW";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Analytics</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Energy Distribution</CardTitle>
              <CardDescription>Current usage by appliance</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    label={({name}) => name}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip 
                    formatter={(value: number) => `${value} W`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Line Chart with Tabs */}
          <Card>
            <CardHeader>
              <CardTitle>Energy Consumption Over Time</CardTitle>
              <Tabs defaultValue="daily" onValueChange={(value) => setTimeRange(value as any)}>
                <TabsList>
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getTimeRangeData()} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} ${getUnitLabel()}`, "Usage"]}
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      border: "none",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="usage"
                    stroke="#0EA5E9"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        {/* Total Energy Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Energy Stats Summary</CardTitle>
            <CardDescription>{getTimeRangeLabel()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard 
                title="Total Consumed" 
                value={timeRange === "daily" ? "25.7 kWh" : timeRange === "weekly" ? "179.3 kWh" : "706.7 kWh"} 
              />
              <StatCard 
                title="Peak Usage" 
                value={timeRange === "daily" ? "3.2 kW" : timeRange === "weekly" ? "4.7 kW" : "5.1 kW"} 
              />
              <StatCard 
                title="Average Usage" 
                value={timeRange === "daily" ? "1.8 kW" : timeRange === "weekly" ? "2.5 kW" : "2.3 kW"} 
              />
              <StatCard 
                title="Est. Cost" 
                value={timeRange === "daily" ? "$3.86" : timeRange === "weekly" ? "$26.90" : "$106.00"} 
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

// Stats card component
const StatCard = ({ title, value }: { title: string; value: string }) => (
  <div className="bg-card border rounded-lg p-4">
    <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

export default Analytics;
