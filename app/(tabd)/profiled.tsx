import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Platform,
  StatusBar,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/constants/constants';
import { useRouter } from 'expo-router';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProfileData = async () => {
    try {
      
      const username = await AsyncStorage.getItem('currentUsername');
      console.log("Username from AsyncStorage:", username);
      const response = await fetch(`${API_URL}/department/profile/${username}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfileData(data);
      console.log(data)
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userToken');
              await AsyncStorage.removeItem('currentUsername');
            
              router.replace('/login');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e3a8a" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1e3a8a" barStyle="light-content" />
      
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {profileData && (
        <>
          <View style={styles.profileOverview}>
            <View style={styles.avatarContainer}>
              {profileData.photo ? (
                <Image source={{ uri: profileData.photo || 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252Fpopulus-63da366b-c99f-403c-b6e5-b7a0a4e9ddad/ImagePicker/d0824b5d-0aa4-428d-812c-2fc5f6403d14.jpeg' }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>
                    {profileData.name?.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.profileName}>{profileData.name}</Text>
            
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.profileSection}>
              <View style={styles.sectionIcon}>
                <Ionicons name="person-outline" size={24} color="#1e3a8a" />
              </View>
              <View style={styles.sectionContent}>
                <Text style={styles.sectionTitle}>Username</Text>
                <Text style={styles.sectionSubtitle}>{profileData.username}</Text>
              </View>
            </View>

            <View style={styles.profileSection}>
              <View style={styles.sectionIcon}>
                <Ionicons name="mail-outline" size={24} color="#1e3a8a" />
              </View>
              <View style={styles.sectionContent}>
                <Text style={styles.sectionTitle}>Email</Text>
                <Text style={styles.sectionSubtitle}>{profileData.email}</Text>
              </View>
            </View>

            <View style={styles.profileSection}>
              <View style={styles.sectionIcon}>
                <Ionicons name="call-outline" size={24} color="#1e3a8a" />
              </View>
              <View style={styles.sectionContent}>
                <Text style={styles.sectionTitle}>Phone</Text>
                <Text style={styles.sectionSubtitle}>{profileData.mobileNo}</Text>
              </View>
            </View>

            <View style={styles.profileSection}>
              <View style={styles.sectionIcon}>
                <Ionicons name="location-outline" size={24} color="#1e3a8a" />
              </View>
              <View style={styles.sectionContent}>
                <Text style={styles.sectionTitle}>District</Text>
                <Text style={styles.sectionSubtitle}>{profileData.district}</Text>
              </View>
            </View>
          </View>

          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={20} color="#ef4444" />
              <Text style={[styles.actionButtonText, { color: '#ef4444' }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerContainer: {
    backgroundColor: '#1e3a8a',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
  },
  profileOverview: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 16,
    color: '#64748b',
  },
  detailsContainer: {
    backgroundColor: '#fff',
    marginTop: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f1f5f9',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  sectionIcon: {
    marginRight: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e6e6fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  actionContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  actionButtonText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#1e293b',
  },
});

export default Profile;