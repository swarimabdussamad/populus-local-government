import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  TextInput,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";

const WeatherCard = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity 
      style={styles.weatherCard}
      onPress={() => navigation.navigate('Weather')}
    >
      <View style={styles.weatherContent}>
        <View style={styles.weatherLeft}>
          <Text style={styles.weatherTemp}>19°</Text>
          <Text style={styles.weatherLocation}>Montreal, Canada</Text>
        </View>
        <View style={styles.weatherRight}>
          <MaterialCommunityIcons name="weather-partly-cloudy" size={40} color="#666" />
          <Text style={styles.weatherCondition}>Partly Cloudy</Text>
        </View>
      </View>
      <View style={styles.weatherFooter}>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#666" />
      </View>
    </TouchableOpacity>
  );
};

const PostTypeModal = ({ visible, onClose, onSelectType }) => (
  <Modal
    visible={visible}
    transparent={true}
    animationType="fade"
    onRequestClose={onClose}
  >
    <TouchableOpacity 
      style={styles.postTypeOverlay} 
      activeOpacity={1} 
      onPress={onClose}
    >
      <View style={styles.postTypeContainer}>
        <TouchableOpacity 
          style={styles.postTypeButton} 
          onPress={() => onSelectType('announcement')}
        >
          <MaterialCommunityIcons name="bullhorn" size={24} color="#6200ee" />
          <Text style={styles.postTypeText}>Announcement</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.postTypeButton} 
          onPress={() => onSelectType('alert')}
        >
          <MaterialCommunityIcons name="alert-circle" size={24} color="#dc3545" />
          <Text style={styles.postTypeText}>Alert</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  </Modal>
);

const PostModal = ({ visible, onClose, postType, onSubmit }) => {
  const [postContent, setPostContent] = useState('');
  const [attachment, setAttachment] = useState(null);

  const handleSubmit = () => {
    onSubmit({
      type: postType,
      content: postContent,
      attachment,
    });
    setPostContent('');
    setAttachment(null);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.postModalContainer}>
        <View style={styles.postModalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close-outline" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.postModalTitle}>
            {postType === 'announcement' ? 'New Announcement' : 'New Alert'}
          </Text>
          <TouchableOpacity 
            style={[
              styles.postModalSubmit,
              !postContent.trim() && styles.postModalSubmitDisabled
            ]} 
            onPress={handleSubmit}
            disabled={!postContent.trim()}
          >
            <Text style={styles.postModalSubmitText}>Post</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.postModalContent}>
          <View style={styles.postTypeIndicator}>
            <MaterialCommunityIcons 
              name={postType === 'announcement' ? 'bullhorn' : 'alert-circle'} 
              size={24} 
              color={postType === 'announcement' ? '#6200ee' : '#dc3545'} 
            />
            <Text style={[
              styles.postTypeIndicatorText,
              { color: postType === 'announcement' ? '#6200ee' : '#dc3545' }
            ]}>
              {postType === 'announcement' ? 'Announcement' : 'Alert'}
            </Text>
          </View>

          <TextInput
            style={styles.postModalInput}
            placeholder={`Write your ${postType}...`}
            value={postContent}
            onChangeText={setPostContent}
            multiline
            textAlignVertical="top"
          />

          <TouchableOpacity 
            style={styles.attachmentButton}
            onPress={() => setAttachment(require('../../assets/images/01.jpg'))}
          >
            <MaterialCommunityIcons name="image-plus" size={24} color="#666" />
            <Text style={styles.attachmentButtonText}>Add Photo</Text>
          </TouchableOpacity>

          {attachment && (
            <View style={styles.attachmentPreview}>
              <Image source={attachment} style={styles.attachmentImage} />
              <TouchableOpacity 
                style={styles.removeAttachment}
                onPress={() => setAttachment(null)}
              >
                <MaterialCommunityIcons name="close-circle" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const [postTypeModalVisible, setPostTypeModalVisible] = useState(false);
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [selectedPostType, setSelectedPostType] = useState(null);

  const handlePostTypeSelect = (type) => {
    setPostTypeModalVisible(false);
    setSelectedPostType(type);
    setPostModalVisible(true);
  };

  const handlePostSubmit = async (postData) => {
    // Here you would typically make an API call to your backend
    try {
      // Mock API call
      const newPost = {
        id: Date.now(),
        type: postData.type,
        content: postData.content,
        attachment: postData.attachment,
        timestamp: new Date().toISOString(),
      };

      // Add to local state
      setPosts([newPost, ...posts]);
      setPostModalVisible(false);
      
      // You would make your actual API call here
      // await api.createPost(postData);
      
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post. Please try again.');
    }
  };

  const renderPost = ({ item }) => (
    <View style={[
      styles.postContainer,
      item.type === 'alert' && styles.alertPost
    ]}>
      <View style={styles.postHeader}>
        <View style={styles.postTypeIndicator}>
          <MaterialCommunityIcons 
            name={item.type === 'announcement' ? 'bullhorn' : 'alert-circle'} 
            size={20} 
            color={item.type === 'announcement' ? '#6200ee' : '#dc3545'} 
          />
          <Text style={[
            styles.postTypeIndicatorText,
            { color: item.type === 'announcement' ? '#6200ee' : '#dc3545' }
          ]}>
            {item.type === 'announcement' ? 'Announcement' : 'Alert'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => {/* Handle delete */}}>
          <MaterialCommunityIcons name="delete-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <Text style={styles.postContent}>{item.content}</Text>
      
      {item.attachment && (
        <Image source={item.attachment} style={styles.postImage} />
      )}
      
      <Text style={styles.postTimestamp}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
    </View>
  );

  return (

    <View style={styles.container}>
      <WeatherCard />

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.postsList}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setPostTypeModalVisible(true)}
      >
        <MaterialCommunityIcons name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      <PostTypeModal
        visible={postTypeModalVisible}
        onClose={() => setPostTypeModalVisible(false)}
        onSelectType={handlePostTypeSelect}
      />

      <PostModal
        visible={postModalVisible}
        onClose={() => setPostModalVisible(false)}
        postType={selectedPostType}
        onSubmit={handlePostSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  weatherCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  weatherContent: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherLeft: {
    flex: 1,
  },
  weatherTemp: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
  },
  weatherLocation: {
    fontSize: 16,
    color: '#666',
  },
  weatherRight: {
    alignItems: 'center',
  },
  weatherCondition: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  weatherFooter: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 12,
    alignItems: 'flex-end',
  },
  postsList: {
    padding: 16,
  },
  postContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  alertPost: {
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  postTypeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  postTypeIndicatorText: {
    fontSize: 14,
    fontWeight: '600',
  },
  postContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 12,
  },
  postTimestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 12,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#6200ee',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  postTypeOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  postTypeContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  postTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  postTypeText: {
    fontSize: 16,
    color: '#333',
  },
  postModalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  postModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  postModalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  postModalSubmit: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#6200ee',
    borderRadius: 20,
  },
  postModalSubmitDisabled: {
    backgroundColor: '#ccc',
  },
  postModalSubmitText: {
    color: '#fff',
    fontWeight: '600',
  },
  postModalContent: {
    flex: 1,
    padding: 16,
  },
  postModalInput: {
    fontSize: 16,
    minHeight: 120,
    marginTop: 16,
    padding: 0,
  },
  attachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  attachmentButtonText: {
    fontSize: 16,
    color: '#666',
  },
  attachmentPreview: {
    marginTop: 16,
    position: 'relative',
  },
  attachmentImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeAttachment: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
  },
});

export default HomeScreen;