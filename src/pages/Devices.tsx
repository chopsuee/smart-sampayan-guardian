
import Header from "@/components/layout/Header";
import { useAuth } from "@/context/AuthContext";
import { useDevices } from "@/context/DeviceContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Settings, ChevronRight, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export default function Devices() {
  const { isAuthenticated, loading } = useAuth();
  const { devices, selectDevice } = useDevices();

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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Manage Devices</h1>
          <Button className="bg-sampayan hover:bg-sampayan-dark">
            Add Device
          </Button>
        </div>
        
        <div className="grid gap-4">
          {devices.map((device) => (
            <Card key={device.id} className="overflow-hidden">
              <CardContent className="p-0">
                <Link 
                  to="/"
                  onClick={() => selectDevice(device.id)}
                  className="flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-sampayan/20 flex items-center justify-center">
                    <Home className="w-5 h-5 text-sampayan" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium">{device.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CircleDot className={cn(
                        "h-3 w-3",
                        device.status === "online" ? "text-green-500" : 
                        device.status === "offline" ? "text-gray-400" : "text-orange-500"
                      )} />
                      <span className="capitalize">{device.status}</span>
                      
                      <span className="mx-1">•</span>
                      
                      <Badge variant="outline" className="font-normal">
                        {device.automationEnabled ? "Auto" : "Manual"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon">
                      <Settings className="w-4 h-4" />
                    </Button>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
          
          {devices.length === 0 && (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <p className="text-muted-foreground mb-4">No devices found</p>
              <Button className="bg-sampayan hover:bg-sampayan-dark">
                Add Your First Device
              </Button>
            </div>
          )}
        </div>
        
        <p className="text-muted-foreground italic mt-6 text-sm">
          This is a placeholder for the device management page. In a full application, you would be able to add new devices, edit their settings, and remove devices here.
        </p>
      </main>
    </div>
  );
}
