import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  ScrollView,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/constants/constants';

const SurveyCard = ({ survey, onPress, onComplete, isActiveTab }) => (
  <TouchableOpacity
    style={[styles.card, !survey.active && styles.inactiveCard]}
    onPress={onPress}
  >
    <View style={styles.cardContent}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{survey.title}</Text>
        <View style={[styles.statusDot, { 
          backgroundColor: survey.active ? '#4CAF50' : '#757575' 
        }]} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Question:</Text>
        <Text style={styles.sectionText}>{survey.question}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Options:</Text>
        <View style={styles.optionsContainer}>
          {survey.options.map((option, index) => (
            <View key={index} style={styles.optionPill}>
              <Text style={styles.optionText}>{option}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Created At:</Text>
        <Text style={styles.sectionText}>
          {new Date(survey.createdAt).toLocaleDateString()}
        </Text>
        <TouchableOpacity 
            style={[styles.actionButton, styles.resultsButton]}
            onPress={onPress}
          >
            <Text style={styles.buttonText}>View Results</Text>
          </TouchableOpacity>
          
        
      </View>

      {isActiveTab && survey.active && (
        <View style={styles.buttonContainer}>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.completeButton]}
            onPress={onComplete}
          >
            <Text style={styles.buttonText}>Complete Survey</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  </TouchableOpacity>
);

const TabBar = ({ activeTab, onTabPress }) => {
  const tabs = [
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' },
  ];

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tab, activeTab === tab.id && styles.activeTab]}
          onPress={() => onTabPress(tab.id)}
        >
          <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const Survey = () => {
  const navigation = useNavigation();
  const [scaleValue] = useState(new Animated.Value(1));
  const [activeTab, setActiveTab] = useState('active');
  const [publicSurveys, setPublicSurveys] = useState([]);
  const scrollViewRef = React.useRef(null);

  const activeSurveys = publicSurveys.filter((survey) => survey.active);
  const completedSurveys = publicSurveys.filter((survey) => !survey.active);

  const fetchData = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      alert('User token not found. Please log in again.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/government/mysurvey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch surveys');
      
      const data = await response.json();
      if (Array.isArray(data.surveys)) {
        setPublicSurveys(data.surveys);
      }
    } catch (error) {
      console.error('Error fetching surveys:', error);
      alert('Failed to fetch surveys');
    }
  };

  const handleCompleteSurvey = async (surveyId) => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      const response = await fetch(`${API_URL}/government/completesurvey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ surveyId }),
      });

      if (response.ok) {
        fetchData();
        alert('Survey marked as completed!');
      } else {
        throw new Error('Failed to complete survey');
      }
    } catch (error) {
      console.error('Error completing survey:', error);
      alert('Failed to complete survey');
    }
  };

  useFocusEffect(
    useCallback(() => { fetchData(); }, [])
  );

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
    const tabIndex = ['active', 'completed'].indexOf(tabId);
    scrollViewRef.current?.scrollTo({
      x: tabIndex * Dimensions.get('window').width,
      animated: true,
    });
  };

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

  useEffect(() => { pulseAnimation(); }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <SafeAreaView style={styles.headerContainer}>
          <StatusBar backgroundColor="#27395D" barStyle="light-content" />
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>My Surveys</Text>
            </View>
            <View style={styles.headerRight}>
              <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => navigation.navigate('NewSurvey')}
                >
                  <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
          <TabBar activeTab={activeTab} onTabPress={handleTabPress} />
        </SafeAreaView>
      ),
    });
  }, [navigation, activeTab]);

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const screenWidth = Dimensions.get('window').width;
    const tabIndex = Math.round(contentOffsetX / screenWidth);
    const tabId = ['active', 'completed'][tabIndex];
    if (activeTab !== tabId) setActiveTab(tabId);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
      >
        <View style={styles.tabContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.cardsContainer}>
              {activeSurveys.map((survey) => (
                <SurveyCard
                  key={survey._id}
                  survey={survey}
                  isActiveTab={activeTab === 'active'}
                  onPress={() => navigation.navigate('SurveyDetail', { survey })}
                  onComplete={() => handleCompleteSurvey(survey._id)}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.tabContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.cardsContainer}>
              {completedSurveys.map((survey) => (
                <SurveyCard
                  key={survey._id}
                  survey={survey}
                  isActiveTab={false}
                  onPress={() => navigation.navigate('SurveyDetail', { survey })}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  headerContainer: {
    backgroundColor: '#1e3a8a',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeTab: {
    backgroundColor: '#ffffff',
  },
  tabText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#1e3a8a',
  },
  tabContent: {
    width: Dimensions.get('window').width,
  },
  cardsContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  section: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  sectionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionPill: {
    backgroundColor: '#F0F4FF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  optionText: {
    fontSize: 14,
    color: '#1e3a8a',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  resultsButton: {
    backgroundColor: '#4CAF50',
  },
  completeButton: {
    backgroundColor: '#1e3a8a',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#1e3a8a',
    width: 40,
    height: 40,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  inactiveCard: {
    opacity: 0.7,
  },
});

export default Survey;