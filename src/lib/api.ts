
import { WeatherData } from "@/types";

export const fetchWeatherData = async (latitude = 52.52, longitude = 13.41): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation_probability,weathercode&current_weather=true&timezone=auto`
    );
    
    if (!response.ok) {
      throw new Error("Weather data fetch failed");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

export const getWeatherIcon = (weatherCode: number): string => {
  // WMO Weather interpretation codes (https://open-meteo.com/en/docs)
  if (weatherCode === 0) return "sun"; // Clear sky
  if (weatherCode <= 3) return "cloud-sun"; // Partly cloudy
  if (weatherCode <= 49) return "cloud"; // Fog
  if (weatherCode <= 69) return "cloud-rain"; // Rain
  if (weatherCode <= 79) return "cloud"; // Snow
  if (weatherCode <= 99) return "cloud-rain"; // Thunderstorm
  return "cloud";
};

export const isPrecipitationLikely = (probability: number): boolean => {
  return probability > 30; // Consider rain likely if probability > 30%
};

export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};
