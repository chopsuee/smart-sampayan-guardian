
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import WeatherCard from "@/components/weather/WeatherCard";
import DeviceCard from "@/components/device/DeviceCard";
import DeviceSelector from "@/components/device/DeviceSelector";
import DeviceStatus from "@/components/device/DeviceStatus";

export default function Dashboard() {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      document.title = "Dashboard - Smart Sampayan";
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <DeviceSelector />
            <DeviceCard />
            <WeatherCard />
          </div>
          <div className="space-y-6">
            <DeviceStatus />
          </div>
        </div>
      </main>
    </div>
  );
}
