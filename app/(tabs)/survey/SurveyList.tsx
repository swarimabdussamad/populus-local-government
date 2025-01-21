import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Animated, 
  ScrollView,
  Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";

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
      headerRight: () => (
        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("NewSurvey")}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </Animated.View>
      ),
      headerTitle: "My Surveys",
      headerTitleStyle: styles.headerTitle,
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
          <Text style={styles.cardTitle}>{survey.title}</Text>
          <View style={[styles.statusDot, 
            { backgroundColor: survey.active ? '#4CAF50' : '#757575' }]} 
          />
        </View>
        <Text style={styles.responseCount}>
          {survey.responses} {survey.responses === 1 ? 'Response' : 'Responses'}
        </Text>
        <View style={styles.cardFooter}>
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewButtonText}>View Results</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        
        <View style={styles.cardsContainer}>
          {surveys.map(renderSurveyCard)}
        </View>
      </ScrollView>
    </View>
  );
};

export default Survey;

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 20,
  },
  cardsContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
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
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  responseCount: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  viewButton: {
    backgroundColor: '#27395D',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#27395D',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});