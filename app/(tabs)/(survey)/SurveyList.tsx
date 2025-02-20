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
  onPress: () => void;
  onComplete?: () => void;
  isActiveTab: boolean;
};

const SurveyCard = ({ survey, onPress, onComplete, isActiveTab }: SurveyCardProps) => {
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
      <TouchableOpacity style={styles.card} onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} activeOpacity={0.9}>
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
              <TouchableOpacity style={[styles.actionButton, styles.resultsButton]} onPress={onPress}>
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
                    onPress={() => navigation.navigate('SurveyResults', { surveyId: survey._id })}
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
                    onPress={() => navigation.navigate('SurveyResults', { surveyId: survey._id })}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerContainer: {
    backgroundColor: '#1e3a8a',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#ffffff',
  },
  tabText: {
    color: '#ffffff',
    fontSize: 15,
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
  cardContainer: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
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
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
    marginRight: 12,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'white',
  },
  section: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionText: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 24,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionPill: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  optionText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  footer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 16,
  },
  dateText: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  resultsButton: {
    backgroundColor: '#2563eb',
  },
  completeButton: {
    backgroundColor: '#059669',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  inactiveCard: {
    opacity: 0.7,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
  },
});

export default Survey;