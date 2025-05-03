
import { useDevices } from "@/context/DeviceContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowUp, ArrowDown, Activity, Settings, Info, Check, X } from "lucide-react";
import { useWeather } from "@/context/WeatherContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function DeviceCard() {
  const { selectedDevice, toggleAutomation, controlSampayan } = useDevices();
  const { isRaining } = useWeather();

  if (!selectedDevice) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Device Control</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Device Control</span>
          <div className="flex items-center gap-1">
            {selectedDevice.status === "online" ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : selectedDevice.status === "maintenance" ? (
              <Info className="w-4 h-4 text-orange-500" />
            ) : (
              <X className="w-4 h-4 text-destructive" />
            )}
            <span 
              className={
                selectedDevice.status === "online" 
                  ? "text-sm text-green-500" 
                  : selectedDevice.status === "maintenance"
                  ? "text-sm text-orange-500"
                  : "text-sm text-destructive"
              }
            >
              {selectedDevice.status.charAt(0).toUpperCase() + selectedDevice.status.slice(1)}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{selectedDevice.name}</h3>
              {selectedDevice.location && (
                <p className="text-sm text-muted-foreground">{selectedDevice.location}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-sampayan" />
              <span className="text-sm">
                {selectedDevice.cycleCount} {selectedDevice.cycleCount === 1 ? "cycle" : "cycles"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 border p-4 rounded-lg">
            <div className="flex-1">
              <div className="text-sm font-medium mb-1">Current Status</div>
              <div className="flex items-center gap-1">
                {selectedDevice.sampayanStatus === "open" ? (
                  <ArrowUp className="w-4 h-4 text-green-500" />
                ) : selectedDevice.sampayanStatus === "closed" ? (
                  <ArrowDown className="w-4 h-4 text-sampayan" />
                ) : (
                  <Settings className="w-4 h-4 animate-spin text-orange-500" />
                )}
                <span className="capitalize font-medium">
                  {selectedDevice.sampayanStatus}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium mb-1">Auto Mode</div>
              <div className="flex items-center gap-2">
                <Switch
                  id="automation"
                  checked={selectedDevice.automationEnabled}
                  onCheckedChange={(checked) => toggleAutomation(selectedDevice.id, checked)}
                />
                <Label htmlFor="automation" className="cursor-pointer">
                  {selectedDevice.automationEnabled ? "Enabled" : "Disabled"}
                </Label>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          onClick={() => controlSampayan(selectedDevice.id, "open")}
          disabled={
            selectedDevice.sampayanStatus === "open" || 
            selectedDevice.sampayanStatus === "moving" || 
            selectedDevice.status !== "online" ||
            (isRaining && selectedDevice.automationEnabled)
          }
          variant="outline"
          className="flex-1 mr-2"
        >
          <ArrowUp className="w-4 h-4 mr-1" /> Open
        </Button>
        <Button
          onClick={() => controlSampayan(selectedDevice.id, "close")}
          disabled={
            selectedDevice.sampayanStatus === "closed" || 
            selectedDevice.sampayanStatus === "moving" || 
            selectedDevice.status !== "online"
          }
          className="flex-1 bg-sampayan hover:bg-sampayan-dark"
        >
          <ArrowDown className="w-4 h-4 mr-1" /> Close
        </Button>
      </CardFooter>
    </Card>
  );
}
