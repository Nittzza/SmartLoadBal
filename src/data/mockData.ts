
import { Appliance } from "@/components/dashboard/AppliancesList";

// Mock user data
export const mockUser = {
  id: "user123",
  name: "Demo User",
  email: "demo@example.com"
};

// Mock appliances data
export const mockAppliances: Appliance[] = [
  {
    id: "app1",
    name: "Refrigerator",
    icon: "refrigerator",
    currentWattage: 150,
    isOn: true,
    isCritical: true,
    priority: "High"
  },
  {
    id: "app2",
    name: "Television",
    icon: "tv",
    currentWattage: 120,
    isOn: true,
    isCritical: false,
    priority: "Medium"
  },
  {
    id: "app3",
    name: "Coffee Maker",
    icon: "coffee",
    currentWattage: 900,
    isOn: true,
    isCritical: false,
    priority: "Low"
  },
  {
    id: "app4",
    name: "Washing Machine",
    icon: "washing-machine",
    currentWattage: 500,
    isOn: false,
    isCritical: false,
    priority: "Medium"
  },
  {
    id: "app5",
    name: "Air Conditioner",
    icon: "fan",
    currentWattage: 1200,
    isOn: true,
    isCritical: false,
    priority: "High"
  },
  {
    id: "app6",
    name: "Server",
    icon: "server",
    currentWattage: 300,
    isOn: true,
    isCritical: true,
    priority: "High"
  }
];

// Mock user settings
export const mockSettings = {
  maxThresholdKw: 3.5,
  autoBalanceEnabled: true,
  notificationsEnabled: true
};
