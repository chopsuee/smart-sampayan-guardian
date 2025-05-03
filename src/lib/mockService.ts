
import { Device, Notification, User } from "@/types";
import { getCurrentTimestamp } from "./api";

// Mock user data
export const mockUser: User = {
  id: "user123",
  name: "Demo User",
  email: "user@example.com",
  devices: [
    {
      id: "device1",
      name: "Balcony Sampayan",
      location: "Balcony",
      status: "online",
      sampayanStatus: "open",
      automationEnabled: true,
      lastMaintenance: "2023-04-15T10:30:00Z",
      cycleCount: 42,
    },
    {
      id: "device2",
      name: "Backyard Sampayan",
      location: "Backyard",
      status: "online",
      sampayanStatus: "closed",
      automationEnabled: false,
      lastMaintenance: "2023-03-20T14:15:00Z",
      cycleCount: 23,
    },
  ],
};

// Mock notifications
export const mockNotifications: Notification[] = [
  {
    id: "notif1",
    type: "weather",
    message: "Rain detected! Your Balcony Sampayan has been automatically closed.",
    timestamp: "2023-05-01T08:30:00Z",
    read: false,
    deviceId: "device1",
  },
  {
    id: "notif2",
    type: "device",
    message: "Maintenance recommended for Backyard Sampayan.",
    timestamp: "2023-04-28T16:45:00Z",
    read: true,
    deviceId: "device2",
  },
  {
    id: "notif3",
    type: "system",
    message: "System update completed successfully.",
    timestamp: "2023-04-25T22:10:00Z",
    read: true,
  },
];

// Mock service functions
export const getUserData = (): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockUser), 500);
  });
};

export const getNotifications = (): Promise<Notification[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockNotifications), 500);
  });
};

export const toggleDeviceAutomation = (deviceId: string, enabled: boolean): Promise<Device> => {
  return new Promise((resolve) => {
    const device = mockUser.devices.find((d) => d.id === deviceId);
    if (device) {
      device.automationEnabled = enabled;
    }
    setTimeout(() => resolve(device as Device), 300);
  });
};

export const updateDeviceStatus = (deviceId: string, status: "open" | "closed" | "moving"): Promise<Device> => {
  return new Promise((resolve) => {
    const device = mockUser.devices.find((d) => d.id === deviceId);
    if (device) {
      device.sampayanStatus = status;
      if (status !== "moving") {
        device.cycleCount += 1;
      }
    }
    setTimeout(() => resolve(device as Device), 300);
  });
};

export const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">): Promise<Notification> => {
  const newNotification: Notification = {
    ...notification,
    id: `notif${mockNotifications.length + 1}`,
    timestamp: getCurrentTimestamp(),
    read: false,
  };
  
  mockNotifications.unshift(newNotification);
  return Promise.resolve(newNotification);
};

export const markNotificationAsRead = (notificationId: string): Promise<void> => {
  return new Promise((resolve) => {
    const notification = mockNotifications.find((n) => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
    setTimeout(() => resolve(), 200);
  });
};
