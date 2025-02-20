import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, ScrollView, Dimensions, SafeAreaView, StatusBar, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/constants/constants';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform } from 'react-native';

export type RootStackParamList = {
  SurveyResults: { surveyId: string };
  NewSurvey: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type SurveyType = {
  _id: string;
  title: string;
  question: string;
  options: string[];
  createdAt: string;
  active: boolean;
};

type SurveyCardProps = {
  survey: SurveyType;
  onViewResults: () => void;
  onComplete?: () => void;
  isActiveTab: boolean;
};

const SurveyCard = ({ survey, onViewResults, onComplete, isActiveTab }: SurveyCardProps) => {
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[styles.cardContainer, { transform: [{ scale: scaleAnim }] }, !survey.active && styles.inactiveCard]}>
      <TouchableOpacity 
        style={styles.card} 
        onPressIn={handlePressIn} 
        onPressOut={handlePressOut} 
        activeOpacity={0.9}
      >
        <LinearGradient colors={survey.active ? ['#ffffff', '#f0f9ff'] : ['#ffffff', '#f5f5f5']} style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{survey.title}</Text>
            <View style={[styles.statusDot, { backgroundColor: survey.active ? '#4CAF50' : '#757575' }]} />
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Question</Text>
            <Text style={styles.sectionText}>{survey.question}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Options</Text>
            <View style={styles.optionsContainer}>
              {survey.options.map((option, index) => (
                <View key={index} style={styles.optionPill}>
                  <Text style={styles.optionText}>{option}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.footer}>
            <Text style={styles.dateText}>Created: {new Date(survey.createdAt).toLocaleDateString()}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.resultsButton]} 
                onPress={onViewResults}
              >
                <Ionicons name="bar-chart-outline" size={18} color="#fff" />
                <Text style={styles.buttonText}>View Results</Text>
              </TouchableOpacity>
              {isActiveTab && survey.active && onComplete && (
                <TouchableOpacity style={[styles.actionButton, styles.completeButton]} onPress={onComplete}>
                  <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                  <Text style={styles.buttonText}>Complete</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const TabBar = ({ activeTab, onTabPress }: { activeTab: string; onTabPress: (tabId: string) => void }) => {
  const tabs = [
    { id: 'active', label: 'Active', icon: 'radio-button-on' },
    { id: 'completed', label: 'Completed', icon: 'checkmark-circle' },
  ];

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => (
        <TouchableOpacity key={tab.id} style={[styles.tab, activeTab === tab.id && styles.activeTab]} onPress={() => onTabPress(tab.id)}>
          <Ionicons name={tab.icon as any} size={18} color={activeTab === tab.id ? '#1e3a8a' : '#ffffff'} />
          <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>{tab.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const Survey = () => {
  const navigation = useNavigation<NavigationProp>();
  const [scaleValue] = useState(new Animated.Value(1));
  const [activeTab, setActiveTab] = useState('active');
  const [publicSurveys, setPublicSurveys] = useState<SurveyType[]>([]);
  const scrollViewRef = React.useRef<ScrollView>(null);

  const activeSurveys = publicSurveys.filter((survey) => survey.active);
  const completedSurveys = publicSurveys.filter((survey) => !survey.active);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        alert('Please log in to view surveys');
        return;
      }

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
      alert('Unable to load surveys. Please try again later.');
    }
  };

  const handleCompleteSurvey = async (surveyId: string) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/government/completesurvey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ surveyId }),
      });

      if (response.ok) {
        await fetchData();
        alert('Survey completed successfully!');
      } else {
        throw new Error('Failed to complete survey');
      }
    } catch (error) {
      console.error('Error completing survey:', error);
      alert('Failed to complete survey. Please try again.');
    }
  };

  useFocusEffect(
    useCallback(() => { fetchData(); }, [])
  );

  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);
    scrollViewRef.current?.scrollTo({
      x: tabId === 'active' ? 0 : Dimensions.get('window').width,
      animated: true,
    });
  };

  const pulseAnimation = useCallback(() => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => pulseAnimation());
  }, [scaleValue]);

  useEffect(() => { pulseAnimation(); }, [pulseAnimation]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <SafeAreaView style={styles.headerContainer}>
          <StatusBar backgroundColor="#1e3a8a" barStyle="light-content" />
          <LinearGradient colors={['#1e3a8a', '#2563eb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>My Surveys</Text>
            </View>
            <View style={styles.headerRight}>
              <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
                <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('NewSurvey')}>
                  <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
              </Animated.View>
            </View>
          </LinearGradient>
          <TabBar activeTab={activeTab} onTabPress={handleTabPress} />
        </SafeAreaView>
      ),
    });
  }, [navigation, activeTab, scaleValue]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const screenWidth = Dimensions.get('window').width;
    const tabIndex = Math.round(contentOffsetX / screenWidth);
    const tabId = ['active', 'completed'][tabIndex];
    if (activeTab !== tabId) setActiveTab(tabId);
  };

  const renderEmptyState = (message: string) => (
    <View style={styles.emptyState}>
      <Ionicons name="document-text-outline" size={48} color="#cbd5e1" />
      <Text style={styles.emptyStateText}>{message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView ref={scrollViewRef} horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={handleScroll}>
        <View style={styles.tabContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.cardsContainer}>
              {activeSurveys.length > 0 ? (
                activeSurveys.map((survey) => (
                  <SurveyCard
                    key={survey._id}
                    survey={survey}
                    isActiveTab={activeTab === 'active'}
                    onViewResults={() => navigation.navigate('SurveyResults', { surveyId: survey._id })}
                    onComplete={() => handleCompleteSurvey(survey._id)}
                  />
                ))
              ) : (
                renderEmptyState('No active surveys')
              )}
            </View>
          </ScrollView>
        </View>
        <View style={styles.tabContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.cardsContainer}>
              {completedSurveys.length > 0 ? (
                completedSurveys.map((survey) => (
                  <SurveyCard
                    key={survey._id}
                    survey={survey}
                    isActiveTab={false}
                    onViewResults={() => navigation.navigate('SurveyResults', { surveyId: survey._id })}
                  />
                ))
              ) : (
                renderEmptyState('No completed surveys')
              )}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

// Keep the styles object from the original question (same as provided earlier)
// Make sure to include all the StyleSheet definitions shown in the original code


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
  headerLeft: {
    flex: 1,
    justifyContent: 'center',
  },
  headerRight: {
    justifyContent: 'center',
    alignItems: 'flex-end',
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