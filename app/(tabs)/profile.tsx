import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Platform,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  Modal,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/constants/constants';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

interface LocalGovernmentProfile {
  _id: string;
  selfGovType: string;
  district: string;
  locality: string;
  email: string;
  phone: string;
  username: string;
  createdAt: string;
}

const Profile = () => {
  const [profileData, setProfileData] = useState<LocalGovernmentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const fetchProfileData = async () => {
    try {
      const username = await AsyncStorage.getItem('currentUsername');
      const token = await AsyncStorage.getItem('userToken');
      
      if (!username || !token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/government/profile/${username}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
            
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { data } = await response.json();
      
      const transformedData: LocalGovernmentProfile = {
        _id: data._id,
        selfGovType: data.selfGovType,
        district: data.district,
        locality: data.locality,
        email: data.email,
        phone: data.phone,
        username: data.username,
        createdAt: data.createdAt
      };

      setProfileData(transformedData);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError(error instanceof Error ? error.message : 'Failed to load profile data');
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
              await AsyncStorage.multiRemove(['userToken', 'currentUsername']);
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

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setIsUpdating(true);
    setPasswordError('');

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${API_URL}/government/update-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update password');
      }

      Alert.alert('Success', 'Password updated successfully');
      setChangePasswordModalVisible(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Password update error:', error);
      setPasswordError(error instanceof Error ? error.message : 'Failed to update password');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e3a8a" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchProfileData}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={styles.errorContainer}>
        <Text>No profile data available</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1e3a8a" barStyle="light-content" />
      
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Government Profile</Text>
      </View>
  
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileOverview}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {profileData.selfGovType?.charAt(0)?.toUpperCase() || 'G'}
            </Text>
          </View>
          <Text style={styles.profileName}>{profileData.selfGovType}</Text>
          <Text style={styles.profileRole}>{profileData.district}</Text>
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
              <Text style={styles.sectionSubtitle}>{profileData.phone || 'Not provided'}</Text>
            </View>
          </View>
  
          <View style={styles.profileSection}>
            <View style={styles.sectionIcon}>
              <Ionicons name="location-outline" size={24} color="#1e3a8a" />
            </View>
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>District</Text>
              <Text style={styles.sectionSubtitle}>{profileData.district || 'Not specified'}</Text>
            </View>
          </View>
  
          <View style={styles.profileSection}>
            <View style={styles.sectionIcon}>
              <Ionicons name="home-outline" size={24} color="#1e3a8a" />
            </View>
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>Locality</Text>
              <Text style={styles.sectionSubtitle}>{profileData.locality || 'Not specified'}</Text>
            </View>
          </View>
  
          <View style={styles.profileSection}>
            <View style={styles.sectionIcon}>
              <Ionicons name="calendar-outline" size={24} color="#1e3a8a" />
            </View>
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>Member Since</Text>
              <Text style={styles.sectionSubtitle}>{formatDate(profileData.createdAt)}</Text>
            </View>
          </View>
        </View>
  
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setChangePasswordModalVisible(true)}
          >
            <Ionicons name="key-outline" size={20} color="#1e3a8a" />
            <Text style={[styles.actionButtonText, { color: '#1e3a8a' }]}>Change Password</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text style={[styles.actionButtonText, { color: '#ef4444' }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Change Password Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={changePasswordModalVisible}
        onRequestClose={() => {
          setChangePasswordModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Password</Text>
            
            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}
            
            <TextInput
              style={styles.input}
              placeholder="Current Password"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            
            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setChangePasswordModalVisible(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setPasswordError('');
                }}
                disabled={isUpdating}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleChangePassword}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalButtonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  retryText: {
    color: '#1e3a8a',
    fontWeight: 'bold',
  },
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
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1e293b',
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#f8fafc',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#e2e8f0',
  },
  saveButton: {
    backgroundColor: '#1e3a8a',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Profile;