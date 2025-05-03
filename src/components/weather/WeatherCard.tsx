
import { useWeather } from "@/context/WeatherContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, CloudRain, Cloud, CloudSun, Sun, Thermometer, Wind } from "lucide-react";
import { useEffect, useState } from "react";

export default function WeatherCard() {
  const { weatherData, loading, error, isRaining, weatherIcon, refreshWeather } = useWeather();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshWeather();
    setRefreshing(false);
  };

  // Create rain animation
  const [raindrops, setRaindrops] = useState<{ id: number; left: string; animationDelay: string }[]>([]);

  useEffect(() => {
    if (isRaining || weatherIcon === "cloud-rain") {
      const drops = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 2}s`,
      }));
      setRaindrops(drops);
    } else {
      setRaindrops([]);
    }
  }, [isRaining, weatherIcon]);

  const getWeatherIcon = () => {
    switch (weatherIcon) {
      case "sun":
        return <Sun className="h-10 w-10 text-yellow-400" />;
      case "cloud-sun":
        return <CloudSun className="h-10 w-10 text-blue-400" />;
      case "cloud-rain":
        return <CloudRain className="h-10 w-10 text-blue-600" />;
      case "cloud":
      default:
        return <Cloud className="h-10 w-10 text-gray-400" />;
    }
  };

  if (loading && !weatherData) {
    return (
      <Card className="relative overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-32">
            <div className="animate-pulse">Loading weather data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-32 flex-col gap-2">
            <p className="text-destructive">{error}</p>
            <Button onClick={handleRefresh} variant="outline" size="sm" className="gap-1">
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      {raindrops.map((drop) => (
        <div
          key={drop.id}
          className="rain"
          style={{
            left: drop.left,
            animationDelay: drop.animationDelay,
          }}
        />
      ))}
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Current Weather</CardTitle>
        <Button
          onClick={handleRefresh}
          variant="ghost"
          size="icon"
          className={refreshing ? "animate-spin" : ""}
          disabled={refreshing}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center p-2 bg-primary/10 rounded-lg">
            {getWeatherIcon()}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-sampayan" />
              <span className="font-semibold text-xl">
                {weatherData?.current_weather?.temperature}°C
              </span>
            </div>
            <div className="flex items-center gap-2">
              {isRaining ? (
                <CloudRain className="h-4 w-4 text-blue-600" />
              ) : (
                <Wind className="h-4 w-4 text-sampayan" />
              )}
              <span>
                {isRaining
                  ? "Currently raining"
                  : weatherIcon === "cloud-rain"
                  ? "Rain expected"
                  : weatherIcon === "cloud-sun"
                  ? "Partly cloudy"
                  : weatherIcon === "sun"
                  ? "Sunny"
                  : "Cloudy"}
              </span>
            </div>
          </div>
        </div>

        {weatherData && (
          <div className="mt-4 border-t pt-4">
            <p className="text-sm text-muted-foreground mb-2">Next 3 hours</p>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 3 }).map((_, index) => {
                if (weatherData.hourly && weatherData.hourly.time && weatherData.hourly.time[index]) {
                  const time = new Date(weatherData.hourly.time[index]);
                  const temp = weatherData.hourly.temperature_2m[index];
                  const precipProb = weatherData.hourly.precipitation_probability?.[index] || 0;
                  const weatherCode = weatherData.hourly.weathercode?.[index];
                  const isRaining = weatherCode >= 50 && weatherCode <= 99;

                  return (
                    <div key={index} className="flex flex-col items-center justify-center p-2 border rounded-lg">
                      <span className="text-xs text-muted-foreground">
                        {time.getHours().toString().padStart(2, "0")}:00
                      </span>
                      <div className="my-1">
                        {isRaining ? (
                          <CloudRain className="h-4 w-4 text-blue-600" />
                        ) : precipProb > 30 ? (
                          <Cloud className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Sun className="h-4 w-4 text-yellow-400" />
                        )}
                      </div>
                      <span className="text-sm font-medium">{temp}°C</span>
                      <span className="text-xs text-muted-foreground">{precipProb}% rain</span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
