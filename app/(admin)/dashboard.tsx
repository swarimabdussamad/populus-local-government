import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const Dashboard = () => {
  // Example data - in a real app, this would come from API/props
  const metrics = {
    localGovernments: 32,
    departments: 18,
    residents: 284650
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Administration Dashboard</Text>
          </View>

          {/* Metrics Grid */}
          <View style={styles.metricsContainer}>
            {/* Local Governments */}
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Local Governments</Text>
              <Text style={styles.metricValue}>{metrics.localGovernments}</Text>
            </View>

            {/* Departments */}
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Departments</Text>
              <Text style={styles.metricValue}>{metrics.departments}</Text>
            </View>

            {/* Total Residents */}
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Total Residents</Text>
              <Text style={styles.metricValue}>{metrics.residents.toLocaleString()}</Text>
            </View>
          </View>

          {/* Summary Section */}
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Regional Overview</Text>
            <Text style={styles.summaryText}>
              The administration oversees {metrics.localGovernments} local government areas 
              through {metrics.departments} specialized departments, serving a population 
              of {metrics.residents.toLocaleString()} residents.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1b1b7e',
    textAlign: 'center',
  },
  metricsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  metricCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  metricValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1b1b7e',
  },
  summaryContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1b1b7e',
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});

export default Dashboard;