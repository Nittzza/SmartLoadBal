import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import { Appliance } from "@/components/dashboard/AppliancesList";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchAppliances, 
  createAppliance, 
  updateAppliance, 
  deleteAppliance,
  toggleApplianceStatus
} from "@/integrations/supabase/services/appliances";
import { useToast } from "@/hooks/use-toast";

const Appliances: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: fetchedAppliances = [], isLoading } = useQuery({
    queryKey: ['appliances'],
    queryFn: fetchAppliances
  });
  
  const [applianceStatus, setApplianceStatus] = useState<Record<string, boolean>>({});

  React.useEffect(() => {
    if (fetchedAppliances.length > 0) {
      const initialStatus: Record<string, boolean> = {};
      fetchedAppliances.forEach((app: any) => {
        initialStatus[app.id] = Math.random() > 0.5;
      });
      setApplianceStatus(initialStatus);
    }
  }, [fetchedAppliances]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentAppliance, setCurrentAppliance] = useState<Appliance | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    wattage: "",
    isOn: true,
    isCritical: false,
    priority: "Medium" as "High" | "Medium" | "Low"
  });

  const createApplianceMutation = useMutation({
    mutationFn: (newAppliance: {
      name: string;
      icon: string;
      max_wattage: number;
      is_critical: boolean;
      priority: 'High' | 'Medium' | 'Low';
    }) => createAppliance(newAppliance),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appliances'] });
      toast({
        title: "Appliance created",
        description: "The appliance has been created successfully."
      });
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create appliance: ${error}`,
        variant: "destructive"
      });
    }
  });

  const updateApplianceMutation = useMutation({
    mutationFn: ({ id, updates }: { 
      id: string; 
      updates: {
        name?: string;
        max_wattage?: number;
        is_critical?: boolean;
        priority?: 'High' | 'Medium' | 'Low';
      };
    }) => updateAppliance(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appliances'] });
      toast({
        title: "Appliance updated",
        description: "The appliance has been updated successfully."
      });
      setIsEditDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update appliance: ${error}`,
        variant: "destructive"
      });
    }
  });

  const deleteApplianceMutation = useMutation({
    mutationFn: (id: string) => deleteAppliance(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appliances'] });
      toast({
        title: "Appliance deleted",
        description: "The appliance has been deleted successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete appliance: ${error}`,
        variant: "destructive"
      });
    }
  });

  const toggleApplianceMutation = useMutation({
    mutationFn: ({ id, isOn }: { id: string; isOn: boolean }) => toggleApplianceStatus(id, isOn),
    onSuccess: (result) => {
      setApplianceStatus(prev => ({
        ...prev,
        [result.id]: result.isOn
      }));
    }
  });

  const handleToggleAppliance = (id: string, isOn: boolean) => {
    setApplianceStatus(prev => ({
      ...prev,
      [id]: isOn
    }));
    toggleApplianceMutation.mutate({ id, isOn });
  };

  const handleEditClick = (appliance: any) => {
    setCurrentAppliance(appliance);
    setFormData({
      name: appliance.name,
      wattage: appliance.max_wattage.toString(),
      isOn: applianceStatus[appliance.id] || false,
      isCritical: appliance.is_critical,
      priority: appliance.priority
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteAppliance = (id: string) => {
    deleteApplianceMutation.mutate(id);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddAppliance = () => {
    createApplianceMutation.mutate({
      name: formData.name,
      icon: 'tv',
      max_wattage: parseInt(formData.wattage) || 0,
      is_critical: formData.isCritical,
      priority: formData.priority
    });
  };

  const handleUpdateAppliance = () => {
    if (!currentAppliance) return;

    updateApplianceMutation.mutate({
      id: currentAppliance.id,
      updates: {
        name: formData.name,
        max_wattage: parseInt(formData.wattage) || 0,
        is_critical: formData.isCritical,
        priority: formData.priority
      }
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      wattage: "",
      isOn: true,
      isCritical: false,
      priority: "Medium"
    });
    setCurrentAppliance(null);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-medium mb-2">Loading appliances...</h2>
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
          <h1 className="text-3xl font-bold">Appliances</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-energy-blue hover:bg-energy-blue/90">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Appliance
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Appliance</DialogTitle>
                <DialogDescription>
                  Create a new appliance to monitor and control.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="wattage" className="text-right">
                    Wattage
                  </Label>
                  <Input
                    id="wattage"
                    name="wattage"
                    type="number"
                    value={formData.wattage}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="priority" className="text-right">
                    Priority
                  </Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="isCritical" className="text-right">
                    Critical
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isCritical"
                      name="isCritical"
                      checked={formData.isCritical}
                      onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, isCritical: checked }))}
                    />
                    <Label htmlFor="isCritical">This appliance cannot be auto-switched off</Label>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="isOn" className="text-right">
                    Status
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isOn"
                      name="isOn"
                      checked={formData.isOn}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isOn: checked }))}
                    />
                    <Label htmlFor="isOn">{formData.isOn ? "On" : "Off"}</Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsAddDialogOpen(false);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button onClick={handleAddAppliance} className="bg-energy-blue hover:bg-energy-blue/90">Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Appliance</DialogTitle>
                <DialogDescription>
                  Modify the appliance details.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-wattage" className="text-right">
                    Wattage
                  </Label>
                  <Input
                    id="edit-wattage"
                    name="wattage"
                    type="number"
                    value={formData.wattage}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-priority" className="text-right">
                    Priority
                  </Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-isCritical" className="text-right">
                    Critical
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="edit-isCritical"
                      name="isCritical"
                      checked={formData.isCritical}
                      onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, isCritical: checked }))}
                    />
                    <Label htmlFor="edit-isCritical">This appliance cannot be auto-switched off</Label>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-isOn" className="text-right">
                    Status
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-isOn"
                      name="isOn"
                      checked={formData.isOn}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isOn: checked }))}
                    />
                    <Label htmlFor="edit-isOn">{formData.isOn ? "On" : "Off"}</Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsEditDialogOpen(false);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateAppliance} className="bg-energy-blue hover:bg-energy-blue/90">Update</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Appliances</CardTitle>
            <CardDescription>
              Manage your connected appliances, their status, and priorities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Wattage</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Critical</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fetchedAppliances.map((appliance: any) => (
                  <TableRow key={appliance.id}>
                    <TableCell className="font-medium">{appliance.name}</TableCell>
                    <TableCell>{appliance.max_wattage} W</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        appliance.priority === "High" 
                          ? "bg-blue-100 text-blue-800" 
                          : appliance.priority === "Medium"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-800"
                      }>
                        {appliance.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch 
                        checked={applianceStatus[appliance.id] || false}
                        onCheckedChange={(checked) => handleToggleAppliance(appliance.id, checked)}
                      />
                    </TableCell>
                    <TableCell>
                      {appliance.is_critical ? (
                        <Badge variant="outline" className="bg-red-100 text-red-800">
                          Critical
                        </Badge>
                      ) : "No"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditClick(appliance)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteAppliance(appliance.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Appliances;
