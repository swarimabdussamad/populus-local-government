import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { WeatherContext } from '@/app/(tabs)/_layout'; // Adjust path as needed

// Define TypeScript interface for weather data
interface WeatherData {
  temperature: number;
  humidity: number;
  windspeed: number;
  weatherCode?: number;
  precipitation?: number;
  uvIndex: number;
  rainProbability?: number;
  location?: string;
  coordinates?: { latitude: number; longitude: number };
}

// Weather code mapping for icons
const WEATHER_CODES = {
  0: { description: 'Clear sky', icon: 'weather-sunny' },
  1: { description: 'Mainly clear', icon: 'weather-partly-cloudy' },
  2: { description: 'Partly cloudy', icon: 'weather-partly-cloudy' },
  3: { description: 'Overcast', icon: 'weather-cloudy' },
  45: { description: 'Foggy', icon: 'weather-fog' },
  51: { description: 'Light drizzle', icon: 'weather-rainy' },
  61: { description: 'Light rain', icon: 'weather-pouring' },
  63: { description: 'Moderate rain', icon: 'weather-pouring' },
  65: { description: 'Heavy rain', icon: 'weather-pouring' },
  80: { description: 'Rain showers', icon: 'weather-partly-rainy' },
  95: { description: 'Thunderstorm', icon: 'weather-lightning-rainy' },
};

// Weather thresholds
const THRESHOLDS = {
  temperature: { 
    extreme_high: 38,
    high: 35,
    low: 20,
    extreme_low: 16
  },
  humidity: { 
    high: 85,
    very_high: 90
  },
  windSpeed: { 
    high: 30,
    storm: 50
  },
  uv_index: {
    moderate: 5,
    high: 7,
    very_high: 10
  }
};

const WeatherCard = () => {
  const navigation = useNavigation();
  const weatherContext = useContext(WeatherContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Add a fallback in case context is undefined
  const { weatherData, setWeatherData } = weatherContext || {};

  // Utility function to check for weather alerts - defined before it's used
  const checkAndShowAlerts = (data: WeatherData) => {
    const alerts = [];
    const { temperature, humidity, windspeed, uvIndex } = data;

    if (temperature > THRESHOLDS.temperature.extreme_high) {
      alerts.push('🌡️ Extreme heat alert! Stay hydrated and avoid outdoor activities.');
    }

    if (humidity > THRESHOLDS.humidity.very_high) {
      alerts.push('💧 Very high humidity! Take necessary precautions.');
    }

    if (windspeed > THRESHOLDS.windSpeed.storm) {
      alerts.push('💨 Strong winds detected. Please be cautious outdoors.');
    }

    if (uvIndex > THRESHOLDS.uv_index.high) {
      alerts.push('☀️ High UV index! Use sun protection.');
    }

    if (alerts.length > 0) {
      Alert.alert('Weather Alerts', alerts.join('\n\n'));
    }
  };

  const fetchWeatherData = async () => {
    // Skip if context is not properly initialized
    if (!setWeatherData) {
      setError('Weather context not initialized');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission is required');
        setLoading(false);
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      // Get location name
      const addresses = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      let locationName = 'Current Location';
      if (addresses && addresses.length > 0) {
        const address = addresses[0];
        locationName = [
          address.city || address.subregion,
          address.region
        ].filter(Boolean).join(', ');
      }

      // Fetch weather data from API
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.coords.latitude}&longitude=${location.coords.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation,uv_index&daily=precipitation_probability_max&timezone=auto`
      );

      if (!response.ok) throw new Error('Weather service unavailable');

      const data = await response.json();
      
      // Process and store weather data
      const processedData: WeatherData = {
        temperature: data.current.temperature_2m,
        humidity: data.current.relative_humidity_2m,
        windspeed: data.current.wind_speed_10m,
        weatherCode: data.current.weather_code,
        precipitation: data.current.precipitation,
        uvIndex: data.current.uv_index,
        rainProbability: data.daily?.precipitation_probability_max[0] || 0,
        location: locationName,
        coordinates: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        }
      };

      // Update context with new weather data
      setWeatherData(processedData);
      
      // Check for weather alerts - explicitly reference the function from this scope
      checkAndShowAlerts(processedData);
      
    } catch (error) {
      console.error('Weather data fetch error:', error);
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if context is properly set up
    if (!weatherContext) {
      setError('Weather context not available');
      setLoading(false);
      return;
    }
    
    // Fetch weather data when component mounts if it's not already available
    if (!weatherData) {
      fetchWeatherData();
    } else {
      setLoading(false);
    }
  }, [weatherData, weatherContext]);

  const handlePress = () => {
    navigation.navigate('Weather');
  };

  // Helper function to get weather icon
  const getWeatherIcon = (code) => {
    return WEATHER_CODES[code]?.icon || 'weather-partly-cloudy';
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#fff" />
          <Text style={styles.loadingText}>Loading weather data...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : weatherData ? (
        <View style={styles.cardContent}>
          <View style={styles.mainInfo}>
            <View style={styles.leftSection}>
              <Text style={styles.temperature}>{Math.round(weatherData.temperature)}°</Text>
              <Text style={styles.location}>{weatherData.location}</Text>
            </View>
            
            <View style={styles.rightSection}>
              <MaterialCommunityIcons 
                name={getWeatherIcon(weatherData.weatherCode)}
                size={38} 
                color="#FFF" 
              />
              <Text style={styles.weatherCondition}>
                {WEATHER_CODES[weatherData.weatherCode]?.description || 'Unknown'}
              </Text>
            </View>
          </View>
          
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="water-percent" size={16} color="#CCC" />
              <Text style={styles.detailText}>{Math.round(weatherData.humidity)}%</Text>
            </View>
            
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="weather-windy" size={16} color="#CCC" />
              <Text style={styles.detailText}>{Math.round(weatherData.windspeed)} km/h</Text>
            </View>
            
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="weather-rainy" size={16} color="#CCC" />
              <Text style={styles.detailText}>{Math.round(weatherData.rainProbability)}%</Text>
            </View>
          </View>
          
          {weatherData.uvIndex > THRESHOLDS.uv_index.moderate && (
            <View style={styles.alertBanner}>
              <MaterialCommunityIcons name="alert" size={14} color="#FFF" />
              <Text style={styles.alertText}>
                {weatherData.uvIndex > THRESHOLDS.uv_index.high ? 'High' : 'Moderate'} UV Index
              </Text>
            </View>
          )}
        </View>
      ) : (
        <Text style={styles.fallbackText}>Weather data unavailable</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Styles remain unchanged
  card: {
    backgroundColor: '#222233',
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 10,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#CCC',
    marginTop: 8,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#FF6B6B',
    textAlign: 'center',
  },
  cardContent: {
    padding: 16,
  },
  mainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    alignItems: 'center',
  },
  temperature: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
  },
  location: {
    fontSize: 14,
    color: '#DDD',
    marginTop: 4,
  },
  weatherCondition: {
    fontSize: 14,
    color: '#DDD',
    marginTop: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    color: '#DDD',
    fontSize: 14,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.3)',
    padding: 8,
    borderRadius: 6,
    marginTop: 12,
    gap: 6,
    justifyContent: 'center',
  },
  alertText: {
    color: '#FFF',
    fontSize: 13,
  },
  fallbackText: {
    padding: 20,
    textAlign: 'center',
    color: '#CCC',
  },
});

export default WeatherCard;