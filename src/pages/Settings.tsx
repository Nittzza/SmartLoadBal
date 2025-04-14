
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { mockSettings } from "@/data/mockData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    maxThresholdKw: mockSettings.maxThresholdKw,
    autoBalanceEnabled: mockSettings.autoBalanceEnabled,
    notificationsEnabled: mockSettings.notificationsEnabled
  });

  const handleSaveSettings = () => {
    // In a real app, this would save to Supabase
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>

        <Card>
          <CardHeader>
            <CardTitle>Load Balancer Settings</CardTitle>
            <CardDescription>Configure how the load balancer manages your appliances</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Maximum threshold setting */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label htmlFor="max-threshold">Maximum Power Threshold</Label>
                <span className="font-medium">{settings.maxThresholdKw} kW</span>
              </div>
              <Slider
                id="max-threshold"
                value={[settings.maxThresholdKw]}
                min={1}
                max={10}
                step={0.1}
                onValueChange={(values) => 
                  setSettings(prev => ({ ...prev, maxThresholdKw: values[0] }))
                }
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                When your total energy consumption exceeds this threshold, the auto balancer will start turning off low-priority appliances.
              </p>
            </div>

            {/* Auto-balance toggle */}
            <div className="flex items-center justify-between p-4 bg-muted/40 rounded-md">
              <div>
                <h3 className="font-medium">Auto Balancer</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically turn off low-priority appliances when usage exceeds threshold
                </p>
              </div>
              <Switch
                checked={settings.autoBalanceEnabled}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, autoBalanceEnabled: checked }))
                }
              />
            </div>

            {/* Notifications toggle */}
            <div className="flex items-center justify-between p-4 bg-muted/40 rounded-md">
              <div>
                <h3 className="font-medium">Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Receive alerts when power consumption exceeds threshold or appliances are auto-switched
                </p>
              </div>
              <Switch
                checked={settings.notificationsEnabled}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, notificationsEnabled: checked }))
                }
              />
            </div>

            {/* Save button */}
            <Button 
              className="w-full bg-energy-blue hover:bg-energy-blue/90"
              onClick={handleSaveSettings}
            >
              <SaveIcon className="mr-2 h-4 w-4" /> Save Settings
            </Button>
          </CardContent>
        </Card>

        {/* Account Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/40 rounded-md">
              <div>
                <h3 className="font-medium">Profile Information</h3>
                <p className="text-sm text-muted-foreground">
                  Update your personal details
                </p>
              </div>
              <Button variant="outline">Edit</Button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-muted/40 rounded-md">
              <div>
                <h3 className="font-medium">Password</h3>
                <p className="text-sm text-muted-foreground">
                  Change your password
                </p>
              </div>
              <Button variant="outline">Update</Button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-muted/40 rounded-md">
              <div>
                <h3 className="font-medium">Delete Account</h3>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and data
                </p>
              </div>
              <Button variant="destructive" size="sm">Delete</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
