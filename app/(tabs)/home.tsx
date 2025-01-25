import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';

const COLORS = {
  primary: '#2C3E50',
  secondary: '#3498DB',
  background: '#F4F6F9',
  text: '#2C3E50',
  subtext: '#7F8C8D',
  white: '#FFFFFF',
  border: '#E0E4E8',
};

const API_BASE_URL = 'https://community-engage-api.yourcompany.com/v1';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPost, setNewPost] = useState({
    department: '',
    title: '',
    content: '',
    imageUri: null,
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/posts`);
      setPosts(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch posts. Please try again later.');
      console.error('Fetch posts error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 800,
    };

    launchImageLibrary(options, (response) => {
      if (response.assets) {
        setNewPost((prev) => ({
          ...prev,
          imageUri: response.assets[0].uri,
        }));
      }
    });
  };

  const submitPost = async () => {
    if (!newPost.title.trim()) {
      Alert.alert('Validation Error', 'Title cannot be empty.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('department', newPost.department);
      formData.append('title', newPost.title);
      formData.append('content', newPost.content);

      if (newPost.imageUri) {
        formData.append('image', {
          uri: newPost.imageUri,
          type: 'image/jpeg',
          name: 'post_image.jpg',
        });
      }

      const response = await axios.post(`${API_BASE_URL}/posts`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setPosts([response.data, ...posts]);
      setModalVisible(false);
      setNewPost({ department: '', title: '', content: '', imageUri: null });
    } catch (error) {
      Alert.alert('Error', 'Failed to submit post. Please try again.');
      console.error('Post submission error:', error);
    }
  };

  const renderPostItem = ({ item }) => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <Text style={styles.departmentBadge}>{item.department}</Text>
        <Text style={styles.postDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
      <Text style={styles.postTitle}>{item.title}</Text>
      {item.imageUri && (
        <Image source={{ uri: item.imageUri }} style={styles.postImage} resizeMode="cover" />
      )}
      <Text style={styles.postContent}>{item.content}</Text>
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="thumbs-up" size={18} color="#4A4A4A" />
          <Text style={styles.actionText}>{item.likes || 0}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="chatbubble-outline" size={18} color="#4A4A4A" />
          <Text style={styles.actionText}>{item.comments || 0}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} />

      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.secondary} style={styles.loader} />
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPostItem}
          keyExtractor={(item) => item._id}
          refreshing={isLoading}
          onRefresh={fetchPosts}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No community posts yet. Be the first to share!
              </Text>
            </View>
          }
        />
      )}

      <TouchableOpacity style={styles.fabButton} onPress={() => setModalVisible(true)}>
        <Icon name="add" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create a New Post</Text>

            <TextInput
              style={styles.input}
              placeholder="Department"
              value={newPost.department}
              onChangeText={(text) => setNewPost((prev) => ({ ...prev, department: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={newPost.title}
              onChangeText={(text) => setNewPost((prev) => ({ ...prev, title: text }))}
            />
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Content"
              value={newPost.content}
              onChangeText={(text) => setNewPost((prev) => ({ ...prev, content: text }))}
              multiline
            />

            <TouchableOpacity style={styles.buttonPrimary} onPress={handleImageUpload}>
              <Text style={styles.buttonPrimaryText}>Upload Image</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonPrimary} onPress={submitPost}>
              <Text style={styles.buttonPrimaryText}>Submit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.buttonPrimary, { backgroundColor: COLORS.subtext }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonPrimaryText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  departmentBadge: {
    backgroundColor: COLORS.secondary,
    color: COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    fontSize: 12,
    fontWeight: '600',
  },
  postDate: {
    fontSize: 12,
    color: COLORS.subtext,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  postContent: {
    fontSize: 15,
    color: COLORS.subtext,
    lineHeight: 22,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  fabButton: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: COLORS.text,
  },
  buttonPrimary: {
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonPrimaryText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    paddingHorizontal: 40,
  },
  emptyStateText: {
    color: COLORS.subtext,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default Home;
