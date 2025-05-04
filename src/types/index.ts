
export type WeatherData = {
  latitude: number;
  longitude: number;
  timezone: string;
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    weathercode: number[];
  };
  current_weather: {
    temperature: number;
    weathercode: number;
    time: string;
  };
};

export type DeviceStatus = "online" | "offline" | "maintenance";
export type SampayanStatus = "open" | "closed" | "moving";

export type Device = {
  id: string;
  name: string;
  location?: string;
  status: DeviceStatus;
  sampayanStatus: SampayanStatus;
  automationEnabled: boolean;
  lastMaintenance?: string;
  cycleCount: number;
  rainDetected?: boolean;
};

export type UserRole = "user" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
  devices: Device[];
};

export type NotificationType = "weather" | "device" | "system";

export type Notification = {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: string;
  read: boolean;
  deviceId?: string;
};
