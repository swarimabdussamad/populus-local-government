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
      toValue: 0.98,
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
    <Animated.View 
      style={[
        styles.cardContainer,
        { transform: [{ scale: scaleAnim }] },
        !survey.active && styles.inactiveCard
      ]}
    >
      <TouchableOpacity 
        style={styles.card}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={styles.titleContainer}>
              <Text style={styles.cardTitle} numberOfLines={1}>{survey.title}</Text>
              <View style={[styles.statusDot, { backgroundColor: survey.active ? '#10B981' : '#9CA3AF' }]} />
            </View>
            <Text style={styles.dateText}>{new Date(survey.createdAt).toLocaleDateString()}</Text>
          </View>

          <Text style={styles.questionText} numberOfLines={2}>{survey.question}</Text>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.optionsScrollView}
          >
            <View style={styles.optionsContainer}>
              {survey.options.map((option, index) => (
                <View key={index} style={styles.optionPill}>
                  <Text style={styles.optionText} numberOfLines={1}>{option}</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.resultsButton]}
              onPress={onViewResults}
            >
              <Ionicons name="bar-chart-outline" size={18} color="#fff" />
              <Text style={styles.buttonText}>Results</Text>
            </TouchableOpacity>
            {isActiveTab && survey.active && onComplete && (
              <TouchableOpacity 
                style={[styles.actionButton, styles.completeButton]}
                onPress={onComplete}
              >
                <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                <Text style={styles.buttonText}>Complete</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const EmptyState = ({ message, icon }: { message: string; icon: string }) => (
  <View style={styles.emptyState}>
    <LinearGradient
      colors={['#f8fafc', '#f1f5f9']}
      style={styles.emptyStateGradient}
    >
      <Ionicons name={icon} size={64} color="#94a3b8" />
      <Text style={styles.emptyStateTitle}>{message}</Text>
      <Text style={styles.emptyStateSubtitle}>
        {message === 'No active surveys' 
          ? 'Create a new survey to get started!'
          : 'Complete some surveys to see them here.'}
      </Text>
    </LinearGradient>
  </View>
);

const TabBar = ({ activeTab, onTabPress }: { activeTab: string; onTabPress: (tab: string) => void }) => {
  const tabs = [
    { id: 'active', label: 'Active', icon: 'radio-button-on' },
    { id: 'completed', label: 'Completed', icon: 'checkmark-circle' },
  ];

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tab, activeTab === tab.id && styles.activeTab]}
          onPress={() => onTabPress(tab.id)}
        >
          <Ionicons 
            name={tab.icon} 
            size={20} 
            color={activeTab === tab.id ? '#1e40af' : '#94A3B8'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === tab.id && styles.activeTabText
          ]}>
            {tab.label}
          </Text>
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

  const sortedActiveSurveys = React.useMemo(() => {
    return publicSurveys
      .filter((survey) => survey.active)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [publicSurveys]);

  const sortedCompletedSurveys = React.useMemo(() => {
    return publicSurveys
      .filter((survey) => !survey.active)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [publicSurveys]);

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
          <LinearGradient 
            colors={['#1e3a8a', '#2563eb']} 
            start={{ x: 0, y: 0 }} 
            end={{ x: 1, y: 1 }} 
            style={styles.headerContent}
          >
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

  return (
    <View style={styles.container}>
      <ScrollView 
        ref={scrollViewRef} 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false} 
        onMomentumScrollEnd={handleScroll}
      >
        <View style={[styles.tabContent, { width: Dimensions.get('window').width }]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.cardsContainer}>
              {sortedActiveSurveys.length > 0 ? (
                sortedActiveSurveys.map((survey) => (
                  <SurveyCard
                    key={survey._id}
                    survey={survey}
                    isActiveTab={activeTab === 'active'}
                    onViewResults={() => navigation.navigate('SurveyResults', { surveyId: survey._id })}
                    onComplete={() => handleCompleteSurvey(survey._id)}
                  />
                ))
              ) : (
                <EmptyState 
                  message="No active surveys" 
                  icon="document-text-outline" 
                />
              )}
            </View>
          </ScrollView>
        </View>
        <View style={[styles.tabContent, { width: Dimensions.get('window').width }]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.cardsContainer}>
              {sortedCompletedSurveys.length > 0 ? (
                sortedCompletedSurveys.map((survey) => (
                  <SurveyCard
                    key={survey._id}
                    survey={survey}
                    isActiveTab={false}
                    onViewResults={() => navigation.navigate('SurveyResults', { surveyId: survey._id })}
                  />
                ))
              ) : (
                <EmptyState 
                  message="No completed surveys" 
                  icon="checkmark-circle-outline" 
                />
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
    backgroundColor: '#1e40af',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  addButton: {
    backgroundColor: '#2563eb',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  // ... (previous code remains the same until the styles)


  // ... (previous styles remain the same)
  
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#EFF6FF',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#94A3B8',
  },
  activeTabText: {
    color: '#1e40af',
  },
  tabContent: {
    flex: 1,
  },
  cardsContainer: {
    padding: 8,
  },
  cardContainer: {
    height: 220,
    marginVertical: 8,
    marginHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  card: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  cardHeader: {
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  questionText: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 12,
  },
  optionsScrollView: {
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 4,
  },
  optionPill: {
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  optionText: {
    fontSize: 13,
    color: '#475569',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 'auto',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  resultsButton: {
    backgroundColor: '#10B981',
  },
  completeButton: {
    backgroundColor: '#1e40af',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyStateGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    borderRadius: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
  },
  inactiveCard: {
    opacity: 0.8,
  },
});

export default Survey;

