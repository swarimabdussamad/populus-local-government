import React, { useEffect, useState } from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  FlatList, 
  Image, 
  ScrollView,
  TouchableOpacity,
  Linking,
  Animated,
  Dimensions,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { API_URL } from '@/constants/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

type MapStackParamList = {
  Map: undefined;
  HouseDetails: { 
    houseDetails: string;
    rationId: string;
    wardNumber: string;
  };
};

type HouseDetailsRouteProp = RouteProp<MapStackParamList, 'HouseDetails'>;

type MemberData = {
  _id: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  mobileNo: string;
  aadhaarNo: string;
  photo: string;
  income?: string;
  occupation?: string;
  isHouseOwner?: boolean;
};

type HouseData = {
  houseDetails: string;
  rationId: string;
  members: MemberData[];
};

const HouseDetails: React.FC = () => {
  const route = useRoute<HouseDetailsRouteProp>();
  const { houseDetails, rationId, wardNumber } = route.params;
  const [houseData, setHouseData] = useState<HouseData | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollY = new Animated.Value(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          throw new Error('User token not found');
        }

        const response = await fetch(`${API_URL}/department/housedetails`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            houseDetails,
            rationId 
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setHouseData({
          houseDetails,
          rationId,
          members: result.data
        });
      } catch (err) {
        console.error('Error while fetching house details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [houseDetails, rationId]);

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 180],
    outputRange: [280, 120],
    extrapolate: 'clamp'
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });

  const renderMemberItem = ({ item }: { item: MemberData }) => (
    <View style={styles.memberCard}>
      <View style={styles.profileContainer}>
        {item.photo ? (
          <Image 
            source={{ uri: item.photo }} 
            style={styles.profileImage}
            resizeMode="cover"
          />
        ) : (
          <LinearGradient 
            colors={['#6a11cb', '#2575fc']} 
            style={styles.profileImage}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.profileInitial}>{item.name.charAt(0)}</Text>
          </LinearGradient>
        )}
        {item.isHouseOwner && (
          <View style={styles.ownerBadge}>
            <Icon name="home" size={14} color="#fff" />
          </View>
        )}
      </View>
      
      <View style={styles.memberDetails}>
        <View style={styles.nameContainer}>
          <Text style={styles.memberName}>{item.name}</Text>
          <TouchableOpacity 
            style={styles.callButton} 
            onPress={() => handleCall(item.mobileNo)}
            activeOpacity={0.7}
          >
            <Icon name="call" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Icon name="person" size={16} color="#6a11cb" />
          </View>
          <Text style={styles.detailValue}>{item.gender}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Icon name="cake" size={16} color="#6a11cb" />
          </View>
          <Text style={styles.detailValue}>{item.dateOfBirth}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Icon name="phone" size={16} color="#6a11cb" />
          </View>
          <Text style={styles.detailValue}>{item.mobileNo}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Icon name="fingerprint" size={16} color="#6a11cb" />
          </View>
          <Text style={styles.detailValue}>{item.aadhaarNo}</Text>
        </View>
        
        {item.occupation && (
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Icon name="work" size={16} color="#6a11cb" />
            </View>
            <Text style={styles.detailValue}>{item.occupation}</Text>
          </View>
        )}
        
        {item.income && (
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Icon name="attach-money" size={16} color="#6a11cb" />
            </View>
            <Text style={styles.detailValue}>₹{item.income}</Text>
          </View>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6a11cb" />
        <Text style={styles.loadingText}>Loading Household Details...</Text>
      </SafeAreaView>
    );
  }

  if (!houseData || houseData.members.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <View style={styles.emptyIllustration}>
          <Icon name="error-outline" size={48} color="#6a11cb" />
        </View>
        <Text style={styles.emptyText}>No Household Data Found</Text>
        <Text style={styles.emptySubtext}>Please check the details and try again</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <Animated.View style={[styles.headerContainer, { height: headerHeight }]}>
          <LinearGradient 
            colors={['#6a11cb', '#2575fc']} 
            style={styles.gradientBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Animated.View style={[styles.headerContent, { opacity: headerOpacity }]}>
              <Text style={styles.headerTitle}>Household Details</Text>
              <View style={styles.houseInfoContainer}>
                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <Icon name="home" size={20} color="#fff" />
                  </View>
                  <Text style={styles.infoText}>House No: {houseData.houseDetails}</Text>
                </View>
                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <Icon name="credit-card" size={20} color="#fff" />
                  </View>
                  <Text style={styles.infoText}>Ration ID: {houseData.rationId}</Text>
                </View>
                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <Icon name="location-on" size={20} color="#fff" />
                  </View>
                  <Text style={styles.infoText}>Ward No: {wardNumber}</Text>
                </View>
              </View>
            </Animated.View>
          </LinearGradient>
        </Animated.View>

        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContentContainer}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {/* Family Members Section - Adjusted positioning */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Family Members</Text>
              <View style={styles.memberCount}>
                <Text style={styles.countText}>{houseData.members.length}</Text>
              </View>
            </View>

            {/* Render each member directly instead of using FlatList */}
            <View style={styles.membersList}>
              {houseData.members.map(item => (
                <View key={item._id} style={styles.memberCard}>
                  <View style={styles.profileContainer}>
                    {item.photo ? (
                      <Image 
                        source={{ uri: item.photo }} 
                        style={styles.profileImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <LinearGradient 
                        colors={['#6a11cb', '#2575fc']} 
                        style={styles.profileImage}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Text style={styles.profileInitial}>{item.name.charAt(0)}</Text>
                      </LinearGradient>
                    )}
                    {item.isHouseOwner && (
                      <View style={styles.ownerBadge}>
                        <Icon name="home" size={14} color="#fff" />
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.memberDetails}>
                    <View style={styles.nameContainer}>
                      <Text style={styles.memberName}>{item.name}</Text>
                      <TouchableOpacity 
                        style={styles.callButton} 
                        onPress={() => handleCall(item.mobileNo)}
                        activeOpacity={0.7}
                      >
                        <Icon name="call" size={18} color="#fff" />
                      </TouchableOpacity>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <View style={styles.detailIcon}>
                        <Icon name="person" size={16} color="#6a11cb" />
                      </View>
                      <Text style={styles.detailValue}>{item.gender}</Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <View style={styles.detailIcon}>
                        <Icon name="cake" size={16} color="#6a11cb" />
                      </View>
                      <Text style={styles.detailValue}>{item.dateOfBirth}</Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <View style={styles.detailIcon}>
                        <Icon name="phone" size={16} color="#6a11cb" />
                      </View>
                      <Text style={styles.detailValue}>{item.mobileNo}</Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <View style={styles.detailIcon}>
                        <Icon name="fingerprint" size={16} color="#6a11cb" />
                      </View>
                      <Text style={styles.detailValue}>{item.aadhaarNo}</Text>
                    </View>
                    
                    {item.occupation && (
                      <View style={styles.detailRow}>
                        <View style={styles.detailIcon}>
                          <Icon name="work" size={16} color="#6a11cb" />
                        </View>
                        <Text style={styles.detailValue}>{item.occupation}</Text>
                      </View>
                    )}
                    
                    {item.income && (
                      <View style={styles.detailRow}>
                        <View style={styles.detailIcon}>
                          <Icon name="attach-money" size={16} color="#6a11cb" />
                        </View>
                        <Text style={styles.detailValue}>₹{item.income}</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    // Reduced negative margin to ensure content is visible
    marginTop: -20,
  },
  scrollContentContainer: {
    paddingTop: 300, // Ensure enough space for the header
    paddingBottom: 40,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  gradientBackground: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  headerContent: {
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 24,
    fontFamily: 'sans-serif-condensed',
  },
  houseInfoContainer: {
    marginTop: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIcon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 16,
    padding: 20,
    marginTop: 20, // Reduced from 60 to ensure visibility
    shadowColor: '#6a11cb',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(106,17,203,0.1)',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    fontFamily: 'sans-serif-condensed',
  },
  memberCount: {
    backgroundColor: '#6a11cb',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  countText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  membersList: {
    // Added to replace FlatList's contentContainerStyle
    paddingBottom: 8,
  },
  memberCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#6a11cb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(106,17,203,0.05)',
  },
  profileContainer: {
    marginRight: 16,
    position: 'relative',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  profileInitial: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  ownerBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  memberDetails: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  memberName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    fontFamily: 'sans-serif-condensed',
  },
  callButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(106,17,203,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  detailValue: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 24,
    fontSize: 16,
    color: '#555',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  emptyIllustration: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#6a11cb',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 20,
    color: '#333',
    fontWeight: '700',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    maxWidth: '80%',
  },
});

export default HouseDetails;