
import React from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Demo data
const data = [
  { time: "00:00", usage: 1.2 },
  { time: "02:00", usage: 0.8 },
  { time: "04:00", usage: 0.7 },
  { time: "06:00", usage: 1.5 },
  { time: "08:00", usage: 2.1 },
  { time: "10:00", usage: 1.8 },
  { time: "12:00", usage: 2.3 },
  { time: "14:00", usage: 2.5 },
  { time: "16:00", usage: 2.6 },
  { time: "18:00", usage: 3.2 },
  { time: "20:00", usage: 2.8 },
  { time: "22:00", usage: 2.0 },
];

const EnergyUsageChart: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Energy Usage (Last 24h)</CardTitle>
        <CardDescription>Hourly energy consumption in kW</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip 
              contentStyle={{
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                border: "none",
              }}
              formatter={(value) => [`${value} kW`, "Usage"]}
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
  );
};

export default EnergyUsageChart;
