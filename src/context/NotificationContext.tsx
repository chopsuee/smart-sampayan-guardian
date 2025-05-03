
import React, { createContext, useContext, useState, useEffect } from "react";
import { Notification } from "@/types";
import { getNotifications, addNotification, markNotificationAsRead } from "@/lib/mockService";
import { useToast } from "@/components/ui/use-toast";
import { toast as sonnerToast } from "sonner";
import { useAuth } from "./AuthContext";

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  addNewNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  // Fetch notifications when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      getNotifications()
        .then((data) => {
          setNotifications(data);
        })
        .catch((error) => {
          console.error("Error fetching notifications:", error);
        });
    } else {
      setNotifications([]);
    }
  }, [isAuthenticated]);

  const addNewNotification = async (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    try {
      const newNotification = await addNotification(notification);
      setNotifications((prev) => [newNotification, ...prev]);
      
      // Show toast notification
      sonnerToast(notification.type === "weather" ? "Weather Alert" : notification.type === "device" ? "Device Alert" : "System Message", {
        description: notification.message,
      });
      
    } catch (error) {
      console.error("Error adding notification:", error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const markPromises = notifications
        .filter((notif) => !notif.read)
        .map((notif) => markNotificationAsRead(notif.id));
      
      await Promise.all(markPromises);
      
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
      
      toast({
        description: "All notifications marked as read",
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const unreadCount = notifications.filter((notif) => !notif.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNewNotification,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
