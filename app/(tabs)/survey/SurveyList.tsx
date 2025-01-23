import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Animated, 
  ScrollView,
  Dimensions,
  SafeAreaView,
  StatusBar
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

const Survey = () => {
  const navigation = useNavigation();
  const [scaleValue] = useState(new Animated.Value(1));
  const [surveys] = useState([
    { id: 1, title: "Customer Feedback", responses: 24, active: true },
    { id: 2, title: "Product Review", responses: 15, active: true },
    { id: 3, title: "User Experience", responses: 8, active: false },
  ]);

  // Floating button animation
  const pulseAnimation = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => pulseAnimation());
  };

  useEffect(() => {
    pulseAnimation();
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const renderSurveyCard = (survey) => (
    <TouchableOpacity 
      key={survey.id}
      style={[styles.card, !survey.active && styles.inactiveCard]}
      onPress={() => navigation.navigate("SurveyDetail", { survey })}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={[styles.statusDot, 
            { backgroundColor: survey.active ? '#4CAF50' : '#757575' }]} 
          />
          <Text style={styles.cardTitle}>{survey.title}</Text>
          <View style={[styles.responseContainer, !survey.active && styles.inactiveResponseContainer]}>
            <Text style={styles.responseCount}>
              {survey.responses} {survey.responses === 1 ? 'Response' : 'Responses'}
            </Text>
          </View>
        </View>
        <View style={styles.cardFooter}>
          <TouchableOpacity style={[styles.viewButton, !survey.active && styles.inactiveViewButton]}>
            <Text style={[styles.viewButtonText, !survey.active && styles.inactiveViewButtonText]}>View Results</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#27395D" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Surveys</Text>
        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("NewSurvey")}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.cardsContainer}>
          {surveys.map(renderSurveyCard)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Survey;

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardsContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inactiveCard: {
    opacity: 0.7,
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    flex: 1,
    marginHorizontal: 12,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  responseContainer: {
    backgroundColor: '#27395D',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  inactiveResponseContainer: {
    backgroundColor: '#666',
  },
  responseCount: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  viewButton: {
    backgroundColor: '#27395D',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  inactiveViewButton: {
    backgroundColor: '#666',
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  inactiveViewButtonText: {
    color: '#ccc',
  },
  addButton: {
    backgroundColor: '#27395D',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
});