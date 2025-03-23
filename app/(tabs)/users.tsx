import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
  Animated,
  Platform,
  StatusBar,
  SafeAreaView,
  Modal,
} from 'react-native';
import { API_URL } from '@/constants/constants';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
interface User {
  _id: string;
  name: string;
  photo?: string;
  dateOfBirth?: string;
  gender?: string;
  // Add other properties as needed
}

interface CustomHeaderProps {
  onRefresh: () => void;
  usersCount: number;
  onAddPress: () => void;
}

const UnverifiedUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
const router = useRouter();
  const fetchUnverifiedUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/government/users`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching unverified users:', error);
      Alert.alert('Error', 'Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      fetchUnverifiedUsers();
    }, [])
  );

  const handleVerify = async (user: User) => {
    try {
      const currentPresidentId = await AsyncStorage.getItem('currentUsername');

      console.log('Request details:', {
        url: `${API_URL}/government/verify-user`,
        user,
        presidentId: currentPresidentId
      });

      const response = await fetch(`${API_URL}/government/verify-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user, presidentId: currentPresidentId }),
      });

      console.log('Response status:', response.status);
      const responseData = await response.clone().json();
      console.log('Response data:', responseData);

      if (!response.ok) {
        throw new Error('Failed to verify user.');
      }

      Alert.alert(
        'Success',
        `${user.name} has been verified.`,
        [{ text: 'OK', onPress: () => {} }],
        { cancelable: false }
      );
      setUsers(users.filter((u) => u._id !== user._id));
    } catch (error) {
      console.error('Error verifying user:', error);
      Alert.alert('Error', 'Failed to verify the users.');
    }
  };

  const handleDelete = async (userId: string, userName: string) => {
    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete ${userName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/government/delete-user/${userId}`, {
                method: 'DELETE',
              });

              if (!response.ok) {
                throw new Error('Failed to delete user.');
              }

              Alert.alert('Success', 'User has been deleted.');
              setUsers(users.filter((u) => u._id !== userId));
            } catch (error) {
              console.error('Error deleting user:', error);
              Alert.alert('Error', 'Failed to delete the user.');
            }
          },
        },
      ]
    );
  };

  const onAddPress = () => {
    try {
      console.log("Attempting to navigate to importResident");
      (navigation as any).navigate('ImportResident');
      console.log("Navigation call completed");
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const renderUserCard = ({ item }: { item: User }) => {
    const UserCard = Animated.createAnimatedComponent(TouchableOpacity);
    
    return (
      <UserCard style={styles.userCard}>
        <View style={styles.userHeader}>
          <View style={styles.avatarContainer}>
            {item.photo ? (
              <Image 
                source={{ uri: item.photo }} 
                style={styles.avatarImage}
                defaultSource={require('@/assets/images/logo.png')}
              />
            ) : (
              <Text style={styles.avatarText}>
                {item.name ? item.name.charAt(0).toUpperCase() : '?'}
              </Text>
            )}
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.name || 'No Name'}</Text>
            <Text style={styles.userDetail}>Username: {item.username || 'N/A'}</Text>
            <Text style={styles.userDetail}>Email: {item.email || 'N/A'}</Text>
            <Text style={styles.userDetail}>Mobile: {item.mobileNo || 'N/A'}</Text>
          </View>
        </View>
  
        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date of Birth:</Text>
            <Text style={styles.detailValue}>{item.dateOfBirth || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Gender:</Text>
            <Text style={styles.detailValue}>{item.gender || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Occupation:</Text>
            <Text style={styles.detailValue}>{item.occupation || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Income:</Text>
            <Text style={styles.detailValue}>{item.income || 'N/A'}</Text>
          </View>
        </View>
  
        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Identification</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Aadhaar No:</Text>
            <Text style={styles.detailValue}>{item.aadhaarNo || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Ration ID:</Text>
            <Text style={styles.detailValue}>{item.rationId || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Ration Card Type:</Text>
            <Text style={styles.detailValue}>{item.rationcardType || 'N/A'}</Text>
          </View>
        </View>
  
        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Address Information</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>House Details:</Text>
            <Text style={styles.detailValue}>{item.houseDetails || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Is Owner:</Text>
            <Text style={styles.detailValue}>{item.isOwnerHome || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Mapped House:</Text>
            <Text style={styles.detailValue}>{item.mappedHouse || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Ward Number:</Text>
            <Text style={styles.detailValue}>{item.wardNumber || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Local Body:</Text>
            <Text style={styles.detailValue}>{item.localBody || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Self Gov Type:</Text>
            <Text style={styles.detailValue}>{item.selfGovType || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>District:</Text>
            <Text style={styles.detailValue}>{item.district || 'N/A'}</Text>
          </View>
        </View>
  
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.verifyButton]}
            onPress={() => handleVerify(item)}
          >
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={() => handleDelete(item._id, item.name)}
          >
            <Ionicons name="trash" size={20} color="#fff" />
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </UserCard>
    );
  };

  const CustomHeader: React.FC<CustomHeaderProps> = ({ onRefresh, usersCount, onAddPress }) => (
    <SafeAreaView style={styles.headerContainer}>
      <StatusBar backgroundColor="#1e3a8a" barStyle="light-content" />
      <View style={styles.statusBarSpace} />
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Unverified Users</Text>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{usersCount}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={onRefresh}
          >
            <Ionicons name="refresh" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={onAddPress}
          >
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
          >
            <Ionicons name="filter" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading users...</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <CustomHeader 
        onRefresh={fetchUnverifiedUsers}
        usersCount={users.length}
        onAddPress={onAddPress}
      />
      <View style={styles.container}>
        <FlatList
          data={users}
          renderItem={renderUserCard}
          keyExtractor={(item) => item._id.toString()}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchUnverifiedUsers();
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No unverified users found</Text>
            </View>
          }
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

// Styles remain the same as in the previous version
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#1e3a8a',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerContainer: {
    backgroundColor: '#1e3a8a',
    paddingTop: Platform.OS === 'android' ? 1 : 0,
  },
  statusBarSpace: {
    height: Platform.OS === 'ios' ? 1 : 0,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12, // Increased padding
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  badgeContainer: {
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
 
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  userDetail: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  verifyButton: {
    backgroundColor: '#10b981',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#64748b',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden', // This ensures the image stays within the circular container
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  detailSection: {
    marginVertical: 8,
    paddingHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    width: '40%',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
 
  mapLink: {
    flex: 1,
  },
  mapLinkText: {
    color: '#0066cc',
    textDecorationLine: 'underline',
  },
  mapIcon: {
    marginLeft: 4,
  },
  modalContainer: {
    flex: 1,
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  map: {
    flex: 1,
  },
  mapFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  coordinatesText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default UnverifiedUsers;