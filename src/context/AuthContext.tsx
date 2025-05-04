
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { getUserData } from "@/lib/mockService";
import { useToast } from "@/components/ui/use-toast";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("smartSampayan_user");
    if (storedUser) {
      // In a real app, we would validate the token with Firebase
      // For now, just fetch the mock user data
      getUserData()
        .then((userData) => {
          setUser(userData);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          localStorage.removeItem("smartSampayan_user");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // In a real app, we would authenticate with Firebase
      // For now, just check if email and password match our mock data
      if (email === "user@example.com" && password === "password") {
        const userData = await getUserData();
        setUser(userData);
        localStorage.setItem("smartSampayan_user", JSON.stringify({ email }));
        toast({
          title: "Login successful",
          description: `Welcome back, ${userData.name}!`,
        });
      } else if (email === "admin@example.com" && password === "admin") {
        // Admin login
        const userData = {
          id: "admin-1",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin" as const,
          devices: [],
        };
        setUser(userData);
        localStorage.setItem("smartSampayan_user", JSON.stringify({ email, role: "admin" }));
        toast({
          title: "Admin Login",
          description: "Welcome to the admin dashboard",
        });
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("smartSampayan_user");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
