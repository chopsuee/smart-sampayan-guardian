
import React, { createContext, useContext, useState, useEffect } from "react";
import { Device } from "@/types";
import { toggleDeviceAutomation, updateDeviceStatus } from "@/lib/mockService";
import { useAuth } from "./AuthContext";
import { useWeather } from "./WeatherContext";
import { useNotifications } from "./NotificationContext";

type DeviceContextType = {
  devices: Device[];
  selectedDevice: Device | null;
  selectDevice: (deviceId: string) => void;
  toggleAutomation: (deviceId: string, enabled: boolean) => Promise<void>;
  controlSampayan: (deviceId: string, action: "open" | "close") => Promise<void>;
};

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const { user, isAuthenticated } = useAuth();
  const { isRaining } = useWeather();
  const { addNewNotification } = useNotifications();

  // Initialize devices from user data
  useEffect(() => {
    if (user && user.devices) {
      setDevices(user.devices);
      if (user.devices.length > 0 && !selectedDevice) {
        setSelectedDevice(user.devices[0]);
      }
    } else {
      setDevices([]);
      setSelectedDevice(null);
    }
  }, [user]);

  // Automation effect - close sampayan if it's raining and automation is enabled
  useEffect(() => {
    if (isRaining && isAuthenticated) {
      devices.forEach(async (device) => {
        if (device.automationEnabled && device.sampayanStatus === "open") {
          try {
            await controlSampayan(device.id, "close");
            addNewNotification({
              type: "device",
              message: `${device.name} was automatically closed due to rain detection.`,
              deviceId: device.id,
            });
          } catch (error) {
            console.error(`Failed to automatically close device ${device.id}:`, error);
          }
        }
      });
    }
  }, [isRaining, devices]);

  const selectDevice = (deviceId: string) => {
    const device = devices.find((d) => d.id === deviceId);
    if (device) {
      setSelectedDevice(device);
    }
  };

  const toggleAutomation = async (deviceId: string, enabled: boolean) => {
    try {
      const updatedDevice = await toggleDeviceAutomation(deviceId, enabled);
      setDevices((prev) =>
        prev.map((d) => (d.id === deviceId ? updatedDevice : d))
      );
      
      if (selectedDevice?.id === deviceId) {
        setSelectedDevice(updatedDevice);
      }
      
      addNewNotification({
        type: "device",
        message: `Automation ${enabled ? "enabled" : "disabled"} for ${updatedDevice.name}.`,
        deviceId,
      });
    } catch (error) {
      console.error("Error toggling device automation:", error);
    }
  };

  const controlSampayan = async (deviceId: string, action: "open" | "close") => {
    try {
      // Set to moving state first
      let updatedDevice = await updateDeviceStatus(deviceId, "moving");
      setDevices((prev) =>
        prev.map((d) => (d.id === deviceId ? updatedDevice : d))
      );
      
      if (selectedDevice?.id === deviceId) {
        setSelectedDevice(updatedDevice);
      }
      
      // Simulate the delay of actually moving the sampayan
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Then set to final state
      updatedDevice = await updateDeviceStatus(deviceId, action === "open" ? "open" : "closed");
      setDevices((prev) =>
        prev.map((d) => (d.id === deviceId ? updatedDevice : d))
      );
      
      if (selectedDevice?.id === deviceId) {
        setSelectedDevice(updatedDevice);
      }
      
      addNewNotification({
        type: "device",
        message: `${updatedDevice.name} is now ${action === "open" ? "open" : "closed"}.`,
        deviceId,
      });
    } catch (error) {
      console.error("Error controlling sampayan:", error);
    }
  };

  return (
    <DeviceContext.Provider
      value={{
        devices,
        selectedDevice,
        selectDevice,
        toggleAutomation,
        controlSampayan,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevices = () => {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error("useDevices must be used within a DeviceProvider");
  }
  return context;
};
