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
import { Platform } from 'react-native';

const SurveyCard = ({ survey, onPress }) => (
  <TouchableOpacity 
    style={[styles.card, !survey.active && styles.inactiveCard]}
    onPress={onPress}
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
      {survey.targetGroup && (
        <Text style={styles.targetGroup}>Target: {survey.targetGroup}</Text>
      )}
      {survey.completionRate && (
        <Text style={styles.completionRate}>Completion: {survey.completionRate}%</Text>
      )}
      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View Results</Text>
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
);

const TabBar = ({ activeTab, onTabPress }) => {
  const tabs = [
    { id: 'active', label: 'Active' },
    { id: 'targeted', label: 'Targeted' },
    { id: 'completed', label: 'Completed' }
  ];

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.tab,
            activeTab === tab.id && styles.activeTab
          ]}
          onPress={() => onTabPress(tab.id)}
        >
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
  const navigation = useNavigation();
  const [scaleValue] = useState(new Animated.Value(1));
  const [activeTab, setActiveTab] = useState('active');
  const scrollViewRef = React.useRef(null);
  
  const surveys = {
    active: [
      { id: 1, title: "Customer Feedback", responses: 24, active: true },
      { id: 2, title: "Product Review", responses: 15, active: true },
    ],
    targeted: [
      { 
        id: 3, 
        title: "Premium User Experience", 
        responses: 45, 
        active: true,
        targetGroup: "Premium Subscribers",
        completionRate: 75
      },
      { 
        id: 4, 
        title: "New Feature Feedback", 
        responses: 30, 
        active: true,
        targetGroup: "Beta Users",
        completionRate: 60
      },
    ],
    completed: [
      { 
        id: 5, 
        title: "Annual Satisfaction Survey", 
        responses: 1000, 
        active: false,
        completionRate: 100
      },
      { 
        id: 6, 
        title: "Platform Usage Survey", 
        responses: 850, 
        active: false,
        completionRate: 100
      },
    ]
  };

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
    const tabIndex = ['active', 'targeted', 'completed'].indexOf(tabId);
    scrollViewRef.current?.scrollTo({
      x: tabIndex * Dimensions.get('window').width,
      animated: true
    });
  };

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
                  onPress={() => navigation.navigate("NewSurvey")}
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
    const tabId = ['active', 'targeted', 'completed'][tabIndex];
    if (activeTab !== tabId) {
      setActiveTab(tabId);
    }
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
        {/* Active Surveys Tab */}
        <View style={[styles.tabContent, { width: Dimensions.get('window').width }]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.cardsContainer}>
              {surveys.active.map((survey) => (
                <SurveyCard
                  key={survey.id}
                  survey={survey}
                  onPress={() => navigation.navigate("SurveyDetail", { survey })}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Targeted Surveys Tab */}
        <View style={[styles.tabContent, { width: Dimensions.get('window').width }]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.cardsContainer}>
              {surveys.targeted.map((survey) => (
                <SurveyCard
                  key={survey.id}
                  survey={survey}
                  onPress={() => navigation.navigate("SurveyDetail", { survey })}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Completed Surveys Tab */}
        <View style={[styles.tabContent, { width: Dimensions.get('window').width }]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.cardsContainer}>
              {surveys.completed.map((survey) => (
                <SurveyCard
                  key={survey.id}
                  survey={survey}
                  onPress={() => navigation.navigate("SurveyDetail", { survey })}
                />
              ))}
            </View>
          </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
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
    flex: 1,
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
    fontSize: 18,
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
    marginBottom: 8,
  },
  targetGroup: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  completionRate: {
    fontSize: 14,
    color: '#4CAF50',
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
    backgroundColor: '#1e3a8a',
    width: 40,
    height: 40,
    borderRadius: 22,
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
});