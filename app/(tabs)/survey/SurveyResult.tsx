import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import React from 'react';

const SurveyResults = () => {
  const route = useRoute();
  const { surveyId } = route.params as { surveyId: string };

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      style={styles.background}
    >
      <Text style={styles.title}>Survey ID:</Text>
      <Text style={styles.idText}>{surveyId}</Text>
      
      {/* Add more content here */}
      <Text style={styles.contentText}>Survey details will be shown here</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#F8FAFC', // Light background color
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b', // Dark text
    marginBottom: 10,
  },
  idText: {
    fontSize: 18,
    fontFamily: 'monospace',
    color: '#2563eb', // Blue accent color
    marginBottom: 30,
  },
  contentText: {
    fontSize: 16,
    color: '#475569', // Medium gray
  },
});

export default SurveyResults;