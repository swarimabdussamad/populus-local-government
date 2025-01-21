import React from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView } from 'react-native';

const Weather = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Weather Forecast</Text>
      </View>

      {/* Current Weather */}
      <View style={styles.currentWeather}>
        <Text style={styles.location}>New York City, USA</Text>
        <Text style={styles.temperature}>28°C</Text>
        <Image
          style={styles.weatherIcon}
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1116/1116453.png' }} // Example weather icon
        />
        <Text style={styles.weatherCondition}>Sunny</Text>
      </View>

      {/* Additional Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailBox}>
          <Text style={styles.detailTitle}>Humidity</Text>
          <Text style={styles.detailValue}>60%</Text>
        </View>
        <View style={styles.detailBox}>
          <Text style={styles.detailTitle}>Wind Speed</Text>
          <Text style={styles.detailValue}>15 km/h</Text>
        </View>
        <View style={styles.detailBox}>
          <Text style={styles.detailTitle}>Feels Like</Text>
          <Text style={styles.detailValue}>30°C</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Weather;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F0F6',
    padding: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  currentWeather: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  location: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF5733',
  },
  weatherIcon: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
  weatherCondition: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  detailsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailBox: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});
