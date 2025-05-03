
import React, { createContext, useContext, useState, useEffect } from "react";
import { WeatherData } from "@/types";
import { fetchWeatherData, getWeatherIcon, isPrecipitationLikely } from "@/lib/api";
import { useAuth } from "./AuthContext";
import { useNotifications } from "./NotificationContext";

type WeatherContextType = {
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
  isRaining: boolean;
  weatherIcon: string;
  refreshWeather: () => Promise<void>;
};

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRaining, setIsRaining] = useState(false);
  const [weatherIcon, setWeatherIcon] = useState("cloud");
  const { isAuthenticated } = useAuth();
  const { addNewNotification } = useNotifications();

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user's location (in a real app, we would use the user's actual location)
      const latitude = 14.5995; // Default to Manila, Philippines
      const longitude = 120.9842;
      
      const data = await fetchWeatherData(latitude, longitude);
      setWeatherData(data);
      
      // Check if it's raining now
      const currentWeatherCode = data.current_weather.weathercode;
      const isCurrentlyRaining = currentWeatherCode >= 50 && currentWeatherCode <= 99;
      setIsRaining(isCurrentlyRaining);
      
      // Get current weather icon
      const icon = getWeatherIcon(currentWeatherCode);
      setWeatherIcon(icon);
      
      // Check if rain is forecasted in the next 3 hours
      const next3HoursIndex = Math.min(3, data.hourly.time.length - 1);
      const rainProbabilityNext3Hours = Math.max(
        ...data.hourly.precipitation_probability.slice(0, next3HoursIndex)
      );
      
      if (isAuthenticated) {
        // Notify if it's raining or high probability in next 3 hours
        if (isCurrentlyRaining && !isRaining) {
          addNewNotification({
            type: "weather",
            message: "It's raining! Your sampayan will be automatically closed if automation is enabled.",
          });
        } else if (isPrecipitationLikely(rainProbabilityNext3Hours) && !isRaining) {
          addNewNotification({
            type: "weather",
            message: `Rain forecasted in the next 3 hours (${rainProbabilityNext3Hours}% probability).`,
          });
        }
      }
    } catch (err) {
      setError("Failed to fetch weather data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchWeather();
      
      // Set up polling for weather updates (every 15 minutes)
      const intervalId = setInterval(fetchWeather, 15 * 60 * 1000);
      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated]);

  const refreshWeather = async () => {
    await fetchWeather();
  };

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        loading,
        error,
        isRaining,
        weatherIcon,
        refreshWeather,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error("useWeather must be used within a WeatherProvider");
  }
  return context;
};
