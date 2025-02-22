import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { API_URL } from '@/constants/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SurveyResult = {
  question: string;
  answers: string[];
  image?: string;
};

const SurveyResults = () => {
  const route = useRoute();
  const { surveyId } = route.params as { surveyId: string };
  const [results, setResults] = useState<SurveyResult[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          setError("User token not found. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/analytics/result`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ surveyId }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setResults(data.results);
        setImage(data.image || null);
      } catch (err) {
        setError(err.message || 'Failed to fetch survey results');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [surveyId]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} style={styles.background}>
      <Text style={styles.title}>Survey Results:</Text>
      <Text style={styles.idText}>ID: {surveyId}</Text>
      
      {results.length === 0 ? (
        <Text style={styles.contentText}>No results available for this survey</Text>
      ) : (
        results.map((result, index) => (
          <View key={index} style={styles.resultContainer}>
            <Text style={styles.questionText}>{result.question}</Text>
            {result.answers.map((answer, idx) => (
              <Text key={idx} style={styles.answerText}>• {answer}</Text>
            ))}
          </View>
        ))
      )}

      {image && (
        <Image source={{ uri: image }} style={styles.resultImage} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  resultContainer: {
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    elevation: 2,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 10,
  },
  answerText: {
    fontSize: 14,
    color: '#475569',
    marginLeft: 10,
    marginBottom: 5,
  },
  resultImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 10,
  },
});

export default SurveyResults;
