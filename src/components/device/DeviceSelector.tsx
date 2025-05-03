
import { useDevices } from "@/context/DeviceContext";
import { Check, ChevronDown, Home, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function DeviceSelector() {
  const { devices, selectedDevice, selectDevice } = useDevices();

  if (!devices.length) {
    return (
      <div className="flex items-center justify-center p-4 border border-dashed rounded-md">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">No devices found</p>
          <Link to="/devices">
            <Button variant="outline" size="sm" className="gap-1">
              <Settings className="w-4 h-4" /> Add Device
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <div className="flex items-center gap-2 truncate">
            <Home className="w-4 h-4 text-sampayan" />
            <span className="truncate">
              {selectedDevice ? selectedDevice.name : "Select device"}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {devices.map((device) => (
          <DropdownMenuItem
            key={device.id}
            onClick={() => selectDevice(device.id)}
            className="cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-sampayan" />
                <span>{device.name}</span>
              </div>
              {selectedDevice?.id === device.id && <Check className="w-4 h-4" />}
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/devices" className="flex items-center gap-2 cursor-pointer">
            <Settings className="w-4 h-4" />
            <span>Manage devices</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
