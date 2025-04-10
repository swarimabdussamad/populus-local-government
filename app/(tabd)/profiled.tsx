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
  Alert,
  TextInput,
  Modal,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/constants/constants';
import { useRouter } from 'expo-router';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  userId: string;
  username: string;
  [key: string]: any;
}

interface DepartmentProfile {
  _id: string;
  departmentName: string;
  accessAreas: string[];
  email: string;
  username: string;
  district: string;
  phone: string;
  createdAt?: string;
  updatedAt?: string;
}

const DepartmentProfile = () => {
  const [profileData, setProfileData] = useState({
    departmentName: '',
    accessAreas: [], // Initialize as empty array
    email: '',
    username: '',
    district: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const router = useRouter();

  const getUserIdFromToken = async (): Promise<string | null> => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return null;
      
      const decoded: DecodedToken = jwtDecode(token);
      console.log(decoded.userId);
      return decoded.userId;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userId = await getUserIdFromToken();
      if (!userId) {
        throw new Error('Authentication required. Please login again.');
      }

      const response = await fetch(`${API_URL}/department/profile/${userId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch profile');
      }

      const responseData = await response.json();
      console.log('Full response data:', responseData);

      // Extract data from the nested structure
      const data = responseData.data;

      setProfileData({
        departmentName: data.departmentName || '',
        accessAreas: data.accessAreas || [],
        email: data.email || '',
        username: data.username || '',
        district: data.district || '',
        phone: data.phone || ''
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load profile data';
      setError(message);
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;
    
    // Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    setPasswordError(null);
    setIsUpdatingPassword(true);
    
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('Authentication required. Please login again.');
      }
      
      const response = await fetch(`${API_URL}/department/update-password`, {
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
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to update password');
      }
      
      Alert.alert(
        'Success', 
        'Password updated successfully. A confirmation email has been sent to your registered email address.',
        [
          {
            text: 'OK',
            onPress: () => {
              setChangePasswordModal(false);
              setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
              });
            }
          }
        ]
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update password';
      setPasswordError(message);
      console.error('Error updating password:', err);
    } finally {
      setIsUpdatingPassword(false);
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
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(['userToken', 'currentUsername']);
              router.replace('/login');
            } catch (err) {
              console.error('Logout error:', err);
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

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchProfileData}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1e3a8a" barStyle="light-content" />
      
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Department Profile</Text>
      </View>

      <ScrollView>
        {profileData && (
          <>
            <View style={styles.profileOverview}>
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                {profileData.departmentName?.charAt(0)?.toUpperCase() || 'D'}
                </Text>
              </View>
              <Text style={styles.profileName}>{profileData.departmentName}</Text>
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
                  <Text style={styles.sectionSubtitle}>{profileData.phone}</Text>
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

              <View style={styles.profileSection}>
                <View style={styles.sectionIcon}>
                  <Ionicons name="map-outline" size={24} color="#1e3a8a" />
                </View>
                <View style={styles.sectionContent}>
                  <Text style={styles.sectionTitle}>Access Areas</Text>
                  <Text style={styles.sectionSubtitle}>
                  {profileData.accessAreas.join(', ') || 'None specified'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.actionContainer}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => setChangePasswordModal(true)}
              >
                <Ionicons name="key-outline" size={20} color="#1e3a8a" />
                <Text style={styles.actionButtonText}>Change Password</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, { borderColor: '#fee2e2' }]}
                onPress={handleLogout}
              >
                <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                <Text style={[styles.actionButtonText, { color: '#ef4444' }]}>Logout</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      {/* Change Password Modal */}
      <Modal
        visible={changePasswordModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setChangePasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Change Password</Text>
            
            {passwordError && (
              <Text style={styles.errorText}>{passwordError}</Text>
            )}
            
            <TextInput
              style={styles.input}
              placeholder="Current Password"
              secureTextEntry
              value={passwordData.currentPassword}
              onChangeText={(text) => setPasswordData({...passwordData, currentPassword: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry
              value={passwordData.newPassword}
              onChangeText={(text) => setPasswordData({...passwordData, newPassword: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              secureTextEntry
              value={passwordData.confirmPassword}
              onChangeText={(text) => setPasswordData({...passwordData, confirmPassword: text})}
            />
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setChangePasswordModal(false);
                  setPasswordError(null);
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                }}
                disabled={isUpdatingPassword}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handlePasswordChange}
                disabled={isUpdatingPassword}
              >
                {isUpdatingPassword ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
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
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#1e3a8a',
    marginLeft: 10,
  },
  cancelButtonText: {
    color: '#64748b',
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default DepartmentProfile;