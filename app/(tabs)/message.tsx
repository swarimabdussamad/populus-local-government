import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Modal, 
  Alert, 
  ActivityIndicator,
  ImageBackground,
  Dimensions
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '@/constants/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

// Define TypeScript interfaces
interface FeedbackItem {
  lastUpdated: string;
  _id: string;
  type: 'suggestion' | 'complaint';
  subject: string;
  message: string;
  name?: string;
  email?: string;
  access: string;
  userId: string;
  isAnonymous: boolean;
  status: 'pending' | 'inProgress' | 'resolved';
  createdAt: string;
}

interface RouteParams {
  userAccess?: string;
  userId?: string;
}

interface FeedbackScreenProps {
  route: {
    params: RouteParams;
  };
  navigation: any;
}

const { width } = Dimensions.get('window');

export default function FeedbackScreen({ route, navigation }: FeedbackScreenProps) {
  const { userAccess = '', userId = '' } = route.params || {};
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'suggestion' | 'complaint'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'inProgress' | 'resolved'>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  // Set navigation title
  useEffect(() => {
    navigation.setOptions({
      title: 'Feedback Center',
      headerStyle: {
        backgroundColor: '#1E3A8A',
      },
      headerTintColor: '#FFFFFF',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerRight: () => (
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={fetchFeedbacks}
        >
          <MaterialIcons name="refresh" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // Fetch feedbacks on component mount
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      setLoading(true);
      const response = await axios.get<FeedbackItem[]>(`${API_URL}/government/gov_display`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setFeedbacks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load feedback. Please try again later.');
      console.error('Error fetching feedbacks:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateFeedbackStatus = async (feedbackId: string, newStatus: 'pending' | 'inProgress' | 'resolved') => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      setStatusUpdateLoading(true);
      await axios.patch(`${API_URL}/government/${feedbackId}/do`, {
        status: newStatus
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Update local state
      setFeedbacks(prevFeedbacks => 
        prevFeedbacks.map(feedback => 
          feedback._id === feedbackId ? { ...feedback, status: newStatus } : feedback
        )
      );
      
      Alert.alert('Success', 'Feedback status updated successfully');
      setModalVisible(false);
    } catch (err) {
      Alert.alert('Error', 'Failed to update feedback status');
      console.error('Error updating feedback status:', err);
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const handleFeedbackPress = (feedback: FeedbackItem) => {
    setSelectedFeedback(feedback);
    setModalVisible(true);
  };

  const getFilteredFeedbacks = () => {
    return feedbacks.filter(feedback => {
      const typeMatch = filterType === 'all' || feedback.type === filterType;
      const statusMatch = filterStatus === 'all' || feedback.status === filterStatus;
      return typeMatch && statusMatch;
    });
  };

  const renderStatusBadge = (status: 'pending' | 'inProgress' | 'resolved') => {
    const statusText = status === 'inProgress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1);
    
    switch (status) {
      case 'pending':
        return (
          <LinearGradient 
            colors={['#FFC107', '#FFD54F']} 
            start={[0, 0]} 
            end={[1, 0]} 
            style={styles.statusBadge}
          >
            <FontAwesome5 name="clock" size={12} color="white" style={styles.badgeIcon} />
            <Text style={styles.statusText}>{statusText}</Text>
          </LinearGradient>
        );
      case 'inProgress':
        return (
          <LinearGradient 
            colors={['#2196F3', '#64B5F6']} 
            start={[0, 0]} 
            end={[1, 0]} 
            style={styles.statusBadge}
          >
            <FontAwesome5 name="tasks" size={12} color="white" style={styles.badgeIcon} />
            <Text style={styles.statusText}>{statusText}</Text>
          </LinearGradient>
        );
      case 'resolved':
        return (
          <LinearGradient 
            colors={['#4CAF50', '#81C784']} 
            start={[0, 0]} 
            end={[1, 0]} 
            style={styles.statusBadge}
          >
            <FontAwesome5 name="check-circle" size={12} color="white" style={styles.badgeIcon} />
            <Text style={styles.statusText}>{statusText}</Text>
          </LinearGradient>
        );
      default:
        return (
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{statusText}</Text>
          </View>
        );
    }
  };
  
  const renderTypeBadge = (type: 'suggestion' | 'complaint') => {
    const typeText = type.charAt(0).toUpperCase() + type.slice(1);
  
    switch (type) {
      case 'suggestion':
        return (
          <View style={styles.suggestionBadge}>
            <Ionicons name="bulb-outline" size={12} color="#0097A7" style={styles.badgeIcon} />
            <Text style={styles.suggestionText}>
              {typeText}
            </Text>
          </View>
        );
      case 'complaint':
        return (
          <View style={styles.complaintBadge}>
            <Ionicons name="warning-outline" size={12} color="#D32F2F" style={styles.badgeIcon} />
            <Text style={styles.complaintText}>
              {typeText}
            </Text>
          </View>
        );
      default:
        return (
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>
              {typeText}
            </Text>
          </View>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#1E3A8A" />
        <Text style={styles.loadingText}>Loading feedbacks...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Ionicons name="alert-circle" size={60} color="#D32F2F" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchFeedbacks}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1E3A8A', '#2563EB']}
        start={[0, 0]}
        end={[1, 0]}
        style={styles.headerGradient}
      >
        <Text style={styles.title}>
          City Feedback Portal
        </Text>
        <Text style={styles.subtitle}>
          Manage and respond to citizen feedback
        </Text>
      </LinearGradient>
      
      {/* Filter options */}
      <View style={styles.filtersContainer}>
        <View style={styles.filterSection}>
          <View style={styles.filterLabelContainer}>
            <Ionicons name="funnel-outline" size={16} color="#1E3A8A" />
            <Text style={styles.filterLabel}>Type:</Text>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={filterType}
              style={styles.picker}
              onValueChange={(itemValue) => setFilterType(itemValue as 'all' | 'suggestion' | 'complaint')}
            >
              <Picker.Item 
                label="All Types" 
                value="all" 
                style={styles.pickerItem}  // Add this
              />
              <Picker.Item 
                label="Suggestions" 
                value="suggestion" 
                style={styles.pickerItem}
              />
              <Picker.Item 
                label="Complaints" 
                value="complaint" 
                style={styles.pickerItem}
              />
            </Picker>
          </View>
        </View>
        
        <View style={styles.filterSection}>
          <View style={styles.filterLabelContainer}>
            <Ionicons name="options-outline" size={16} color="#1E3A8A" />
            <Text style={styles.filterLabel}>Status:</Text>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={filterStatus}
              style={styles.picker}
              onValueChange={(itemValue) => setFilterStatus(itemValue as 'all' | 'pending' | 'inProgress' | 'resolved')}
            >
              <Picker.Item label="All Statuses" value="all" style={styles.pickerItem}/>
              <Picker.Item label="Pending" value="pending" style={styles.pickerItem}/>
              <Picker.Item label="In Progress" value="inProgress" style={styles.pickerItem}/>
              <Picker.Item label="Resolved" value="resolved" style={styles.pickerItem}/>
            </Picker>
          </View>
        </View>
      </View>

      <View style={styles.feedbackCountContainer}>
        <Ionicons name="document-text-outline" size={16} color="#666" />
        <Text style={styles.feedbackCount}>
          {getFilteredFeedbacks().length} {getFilteredFeedbacks().length === 1 ? 'entry' : 'entries'} found
        </Text>
      </View>
      
      {/* Feedback list */}
      <ScrollView style={styles.feedbackList} showsVerticalScrollIndicator={false}>
        {getFilteredFeedbacks().length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="search-outline" size={60} color="#CCC" />
            <Text style={styles.noFeedbackText}>No feedback entries match your current filters.</Text>
          </View>
        ) : (
          getFilteredFeedbacks().map((feedback) => (
            <TouchableOpacity 
              key={feedback._id} 
              style={styles.feedbackItem}
              onPress={() => handleFeedbackPress(feedback)}
              activeOpacity={0.7}
            >
              <View style={styles.feedbackHeader}>
                <View style={styles.headerLeft}>
                  {renderTypeBadge(feedback.type)}
                  <Text style={styles.feedbackSubject} numberOfLines={1}>
                    {feedback.subject}
                  </Text>
                </View>
                {renderStatusBadge(feedback.status)}
              </View>
              
              <Text style={styles.feedbackMessage} numberOfLines={2}>
                {feedback.message}
              </Text>
              
              <View style={styles.feedbackFooter}>
                <View style={styles.authorContainer}>
                  <Ionicons name="person-outline" size={14} color="#666" style={styles.footerIcon} />
                  <Text style={styles.feedbackAuthor}>
                    {feedback.isAnonymous ? 'Anonymous' : feedback.name || 'Unnamed User'}
                  </Text>
                </View>
                <View style={styles.dateContainer}>
                  <Ionicons name="calendar-outline" size={14} color="#666" style={styles.footerIcon} />
                  <Text style={styles.feedbackDate}>{formatDate(feedback.createdAt)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
        <View style={styles.listPadding} />
      </ScrollView>

      {/* Feedback detail modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedFeedback && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalTitleContainer}>
                    <Ionicons name="chatbox-ellipses-outline" size={20} color="#1E3A8A" />
                    <Text style={styles.modalTitle}>Feedback Details</Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => setModalVisible(false)}
                    style={styles.closeButton}
                  >
                    <MaterialIcons name="close" size={20} color="white" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                  <View style={styles.detailHeaderSection}>
                    <View style={styles.detailHeaderRow}>
                      <View style={styles.detailHeaderItem}>
                        <Text style={styles.detailHeaderLabel}>Type</Text>
                        {renderTypeBadge(selectedFeedback.type)}
                      </View>
                      <View style={styles.detailHeaderItem}>
                        <Text style={styles.detailHeaderLabel}>Status</Text>
                        {renderStatusBadge(selectedFeedback.status)}
                      </View>
                    </View>
                  </View>

                  <View style={styles.detailCard}>
                    <View style={styles.detailSection}>
                      <View style={styles.detailLabelContainer}>
                        <Ionicons name="clipboard-outline" size={16} color="#1E3A8A" />
                        <Text style={styles.detailLabel}>Subject:</Text>
                      </View>
                      <Text style={styles.detailValue}>{selectedFeedback.subject}</Text>
                    </View>

                    <View style={styles.detailSection}>
                      <View style={styles.detailLabelContainer}>
                        <Ionicons name="chatbubble-outline" size={16} color="#1E3A8A" />
                        <Text style={styles.detailLabel}>Message:</Text>
                      </View>
                      <Text style={styles.detailValue}>{selectedFeedback.message}</Text>
                    </View>

                    <View style={styles.detailRowGroup}>
                      <View style={styles.detailSection}>
                        <View style={styles.detailLabelContainer}>
                          <Ionicons name="person-outline" size={16} color="#1E3A8A" />
                          <Text style={styles.detailLabel}>Submitted by:</Text>
                        </View>
                        <Text style={styles.detailValue}>
                          {selectedFeedback.isAnonymous ? 'Anonymous' : (selectedFeedback.name || 'Unnamed User')}
                        </Text>
                      </View>

                      {!selectedFeedback.isAnonymous && selectedFeedback.email && (
                        <View style={styles.detailSection}>
                          <View style={styles.detailLabelContainer}>
                            <Ionicons name="mail-outline" size={16} color="#1E3A8A" />
                            <Text style={styles.detailLabel}>Contact Email:</Text>
                          </View>
                          <Text style={styles.detailValue}>{selectedFeedback.email}</Text>
                        </View>
                      )}

                      <View style={styles.detailSection}>
                        <View style={styles.detailLabelContainer}>
                          <Ionicons name="calendar-outline" size={16} color="#1E3A8A" />
                          <Text style={styles.detailLabel}>Submitted on:</Text>
                        </View>
                        <Text style={styles.detailValue}>{formatDate(selectedFeedback.createdAt)}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Status management */}
<View style={styles.statusManagement}>
  <View style={styles.statusManagementHeader}>
    <Ionicons name="pulse-outline" size={18} color="#F0F4FF" />
    <Text style={styles.statusManagementTitle}>Status Management</Text>
  </View>
  
  <View style={styles.statusContent}>
    <Text style={styles.statusLabel}>Current Status: <Text style={styles.statusValue}>{selectedFeedback.status}</Text></Text>
    
    <View style={styles.statusButtonGroup}>
      <TouchableOpacity 
        style={[
          styles.statusButton, 
          selectedFeedback.status === 'pending' ? styles.activeStatusButton : null
        ]}
        onPress={() => updateFeedbackStatus(selectedFeedback._id, 'pending')}
        disabled={statusUpdateLoading || selectedFeedback.status === 'pending'}
      >
        <Ionicons 
          name="time-outline" 
          size={16} 
          color={selectedFeedback.status === 'pending' ? 'white' : '#495057'} 
        />
        <Text style={[
          styles.statusButtonText, 
          selectedFeedback.status === 'pending' ? styles.activeStatusButtonText : null
        ]}>
          Pending
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.statusButton, 
          selectedFeedback.status === 'inProgress' ? styles.activeStatusButton : null
        ]}
        onPress={() => updateFeedbackStatus(selectedFeedback._id, 'inProgress')}
        disabled={statusUpdateLoading || selectedFeedback.status === 'inProgress'}
      >
        <Ionicons 
          name="sync-outline" 
          size={16} 
          color={selectedFeedback.status === 'inProgress' ? 'white' : '#495057'} 
        />
        <Text style={[
          styles.statusButtonText, 
          selectedFeedback.status === 'inProgress' ? styles.activeStatusButtonText : null
        ]}>
          In Progress
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.statusButton, 
          selectedFeedback.status === 'resolved' ? styles.activeStatusButton : null
        ]}
        onPress={() => updateFeedbackStatus(selectedFeedback._id, 'resolved')}
        disabled={statusUpdateLoading || selectedFeedback.status === 'resolved'}
      >
        <Ionicons 
          name="checkmark-circle-outline" 
          size={16} 
          color={selectedFeedback.status === 'resolved' ? 'white' : '#495057'} 
        />
        <Text style={[
          styles.statusButtonText, 
          selectedFeedback.status === 'resolved' ? styles.activeStatusButtonText : null
        ]}>
          Resolved
        </Text>
      </TouchableOpacity>
    </View>
    
    {statusUpdateLoading && (
      <View style={styles.statusLoadingContainer}>
        <ActivityIndicator size="small" color="#1E3A8A" />
        <Text style={styles.statusLoadingText}>Updating...</Text>
      </View>
    )}
    
    <View style={styles.lastUpdatedContainer}>
      <Text style={styles.lastUpdatedText}>
        Last updated: {selectedFeedback.lastUpdated || 'Never'}
      </Text>
    </View>
  </View>
</View>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  headerGradient: {
    padding: 20,
    paddingTop: 15,
    paddingBottom: 25,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  refreshButton: {
    marginRight: 15,
    padding: 5,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    color: '#D32F2F',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 12,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#1E3A8A',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 5,
    marginBottom: 16,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  filterSection: {
    flex: 1,
    marginRight: 8,
  },
  filterLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  filterLabel: {
    fontWeight: 'bold',
    marginLeft: 4,
    color: '#1E3A8A',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F9FAFC',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  pickerItem: {
    fontSize: 14,  // Adjust font size
    height: 30,    // Item height
  },
  feedbackCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  feedbackCount: {
    marginLeft: 4,
    color: '#666',
    fontStyle: 'italic',
  },
  feedbackList: {
    paddingHorizontal: 16,
  },
  listPadding: {
    height: 20,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noFeedbackText: {
    textAlign: 'center',
    marginTop: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  feedbackItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#1E3A8A',
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  typeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  suggestionBadge: {
    backgroundColor: '#E0F7FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  complaintBadge: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestionText: {
    color: '#0097A7',
    fontSize: 12,
    fontWeight: 'bold',
  },
  complaintText: {
    color: '#D32F2F',
    fontSize: 12,
    fontWeight: 'bold',
  },
  badgeIcon: {
    marginRight: 4,
  },
  feedbackSubject: {
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
    color: '#1A202C',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  feedbackMessage: {
    color: '#555',
    marginBottom: 12,
    lineHeight: 20,
  },
  feedbackFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 12,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerIcon: {
    marginRight: 4,
  },
  feedbackAuthor: {
    color: '#666',
    fontSize: 12,
  },
  feedbackDate: {
    color: '#666',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#F5F7FA',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    backgroundColor: 'white',
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginLeft: 8,
  },
  closeButton: {
    backgroundColor: '#1E3A8A',
    padding: 6,
    borderRadius: 20,
  },
  modalBody: {
    padding: 0,
  },
  detailHeaderSection: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  detailHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  detailHeaderItem: {
    alignItems: 'center',
  },
  detailHeaderLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  detailCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  detailSection: {
    marginBottom: 16,
  },
  detailLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginLeft: 6,
  },
  detailValue: {
    color: '#333',
    lineHeight: 22,
    paddingLeft: 22, // Align with icons
  },
  detailRowGroup: {
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 12,
    marginTop: 8,
  },
  // statusManagement: {
  //   backgroundColor: 'white',
  //   borderRadius: 12,
  //   margin: 16,
  //   overflow: 'hidden',
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 1 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 3,
  //   elevation: 2,
  // },
  // statusManagementHeader: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   padding: 16,
  //   backgroundColor: '#1E3A8A',
  // },
  // statusManagementTitle: {
  //   color: 'white',
  //   fontWeight: 'bold',
  //   marginLeft: 8,
  // },
  // statusButtons: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   padding: 16,
  // },
  // statusButton: {
  //   flex: 1,
  //   padding: 12,
  //   backgroundColor: '#F5F7FA',
  //   borderRadius: 8,
  //   alignItems: 'center',
  //   marginHorizontal: 4,
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  // },
  // activeStatusButton: {
  //   backgroundColor: '#1E3A8A',
  // },
  // statusButtonText: {
  //   fontWeight: 'bold',
  //   marginLeft: 8,
  //   color: '#666',
  // },
  // activeStatusButtonText: {
  //   color: 'white',
  // },
  // statusLoadingContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   paddingBottom: 16,
  // },
  // statusLoadingText: {
  //   marginLeft: 8,
  //   color: '#666',
  // }
  // Add these styles to your existing styles object
statusManagement: {
  backgroundColor: '#FFFFFF',
  borderRadius: 6,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
  elevation: 2,
  marginBottom: 16,
  overflow: 'hidden',
},
statusManagementHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#1E3A8A',
  paddingVertical: 12,
  paddingHorizontal: 16,
},
statusManagementTitle: {
  color: '#FFFFFF',
  fontWeight: '600',
  fontSize: 16,
  marginLeft: 8,
},
statusContent: {
  padding: 16,
},
statusLabel: {
  fontSize: 14,
  color: '#64748B',
  marginBottom: 16,
},
statusValue: {
  color: '#0F172A',
  fontWeight: '600',
  textTransform: 'capitalize',
},
statusButtonGroup: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 16,
},
statusButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#F8FAFC',
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderRadius: 4,
  borderWidth: 1,
  borderColor: '#E2E8F0',
  flex: 1,
  marginHorizontal: 4,
},
activeStatusButton: {
  backgroundColor: '#1E3A8A',
  borderColor: '#1E3A8A',
},
statusButtonText: {
  fontSize: 13,
  color: '#475569',
  fontWeight: '500',
  marginLeft: 4,
},
activeStatusButtonText: {
  color: '#FFFFFF',
},
statusLoadingContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 8,
},
statusLoadingText: {
  fontSize: 13,
  color: '#64748B',
  marginLeft: 8,
},
lastUpdatedContainer: {
  marginTop: 8,
  alignItems: 'flex-end',
},
lastUpdatedText: {
  fontSize: 12,
  color: '#94A3B8',
  fontStyle: 'italic',
}
});