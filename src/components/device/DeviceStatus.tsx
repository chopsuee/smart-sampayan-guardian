
import { useDevices } from "@/context/DeviceContext";
import { Card, CardContent } from "@/components/ui/card";
import { CircleDot, Activity, Clock, AlertTriangle, Heart } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function DeviceStatus() {
  const { selectedDevice } = useDevices();

  if (!selectedDevice) return null;

  // Simulate maintenance status
  const cycleThreshold = 100; // Maintenance recommended after 100 cycles
  const cyclePercentage = Math.min((selectedDevice.cycleCount / cycleThreshold) * 100, 100);
  const maintenanceSoon = cyclePercentage > 70;
  const needsMaintenance = cyclePercentage >= 100;

  // Format last maintenance date
  const lastMaintenanceDate = selectedDevice.lastMaintenance 
    ? new Date(selectedDevice.lastMaintenance).toLocaleDateString() 
    : "Not available";

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Device Health</h3>
        <div className="space-y-6">
          {/* Device Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CircleDot className={cn(
                "h-4 w-4",
                selectedDevice.status === "online" ? "text-green-500" : 
                selectedDevice.status === "offline" ? "text-gray-400" : "text-orange-500"
              )} />
              <span>Status</span>
            </div>
            <span className="font-medium capitalize">{selectedDevice.status}</span>
          </div>

          {/* Cycle Count */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-sampayan" />
                <span>Cycle Count</span>
              </div>
              <span className="font-medium">{selectedDevice.cycleCount} cycles</span>
            </div>
            <div className="space-y-1">
              <Progress value={cyclePercentage} className={cn(
                needsMaintenance ? "text-destructive" : 
                maintenanceSoon ? "text-orange-500" : "text-sampayan"
              )} />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>Maintenance at {cycleThreshold}</span>
              </div>
            </div>
          </div>

          {/* Last Maintenance */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-sampayan" />
              <span>Last Maintenance</span>
            </div>
            <span className="font-medium">{lastMaintenanceDate}</span>
          </div>

          {/* Alert if maintenance needed */}
          {needsMaintenance && (
            <div className="flex items-center gap-2 p-2 bg-destructive/10 text-destructive rounded border border-destructive/20">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">Maintenance required</span>
            </div>
          )}
          
          {/* Alert if maintenance recommended soon */}
          {maintenanceSoon && !needsMaintenance && (
            <div className="flex items-center gap-2 p-2 bg-orange-500/10 text-orange-500 rounded border border-orange-500/20">
              <Heart className="h-4 w-4" />
              <span className="text-sm">Maintenance recommended soon</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
