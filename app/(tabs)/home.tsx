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
  Pressable,
  RefreshControl,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { API_URL } from '@/constants/constants';
import styles from "./Styles/homestyle"



const COLORS = {
  primary: '#2C3E50', // Deep navy blue
  secondary: '#1E88E5', // Vibrant blue
  background: '#F8F9FA', // Light gray background
  text: '#212121', // Dark gray for readability
  subtext: '#757575', // Muted gray for less prominent text
  white: '#FFFFFF',
  border: '#E0E0E0', // Subtle border color
  error: '#D32F2F', // Strong red for errors
  success: '#388E3C', // Green for success messages
};


const DEPARTMENTS: Department[] = [
  { 
    id: 'local', 
    name: 'Local Government', 
    color: '#3498DB',
    icon: 'account-balance',  // ✅ MaterialIcons
    iconFamily: 'MaterialIcons'
  },
  { 
    id: 'health', 
    name: 'Health Department', 
    color: '#2ECC71',
    icon: 'local-hospital',  // ✅ MaterialIcons
    iconFamily: 'MaterialIcons'
  },
  { 
    id: 'police', 
    name: 'Police Department', 
    color: '#34495E',
    icon: 'police-badge',  // ✅ MaterialCommunityIcons
    iconFamily: 'MaterialCommunityIcons'
  },
  { 
    id: 'fire', 
    name: 'Fire Department', 
    color: '#E74C3C',
    icon: 'fire-truck',  // ✅ MaterialCommunityIcons
    iconFamily: 'MaterialCommunityIcons'
  },
  { 
    id: 'education', 
    name: 'Education Department', 
    color: '#9B59B6',
    icon: 'school',  // ✅ MaterialIcons
    iconFamily: 'MaterialIcons'
  },
  { 
    id: 'transport', 
    name: 'Transportation Department', 
    color: '#F1C40F',
    icon: 'bus',  // ✅ MaterialCommunityIcons
    iconFamily: 'MaterialCommunityIcons'
  },
  { 
    id: 'environment', 
    name: 'Environmental Department', 
    color: '#16A085',
    icon: 'leaf',  // ✅ MaterialCommunityIcons
    iconFamily: 'MaterialCommunityIcons'
  },
  { 
    id: 'social', 
    name: 'Social Services', 
    color: '#E67E22',
    icon: 'account-group',  // ✅ MaterialCommunityIcons
    iconFamily: 'MaterialCommunityIcons'
  },
];


type Department = {
  id: string;
  name: string;
  color: string;
  icon: string;
  iconFamily: 'MaterialIcons'|'MaterialCommunityIcons';
};

type Post = {
  _id: string;
  department: string;
  title: string;
  content: string;
  imageUri?: string;
  createdAt: string;
  likes?: number;
  dislikes?: number;
  comments?: number;
};


// Department Icon Component
const DepartmentIcon: React.FC<{ department: Department; size?: number; color?: string }> = ({
  department,
  size = 24,
  color,
}) => {
  if (!department) return null;

  if (department.iconFamily === 'MaterialIcons') {
    return <MaterialIcons name={department.icon} size={size} color={color || department.color} />;
  } else if (department.iconFamily === 'MaterialCommunityIcons') {
    return <MaterialCommunityIcons name={department.icon} size={size} color={color || department.color} />;
  }

  return null;
};


// Department Picker Component
const DepartmentPicker: React.FC<{
  selectedDepartment: string;
  onSelect: (id: string) => void;
}> = ({ selectedDepartment, onSelect }) => {
  const [isVisible, setIsVisible] = useState(false);
  const selectedDept = DEPARTMENTS.find((d) => d.id === selectedDepartment);;

  return (
    <>
      <Pressable
        style={styles.departmentInput}
        onPress={() => setIsVisible(true)}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {selectedDept && (
            <DepartmentIcon department={selectedDept} size={20}  />
          )}
          <Text style={styles.departmentInputText}>
            {selectedDept ? selectedDept.name : 'Select Department'}
          </Text>
        </View>
        <Icon name="chevron-down" size={20} color={COLORS.subtext} />
      </Pressable>

      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.pickerModalContainer}>
          <View style={styles.pickerModalContent}>
            <Text style={styles.pickerModalTitle}>Select Department</Text>
            
            <FlatList
              data={DEPARTMENTS}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.departmentOption}
                  onPress={() => {
                    onSelect(item.id);
                    setIsVisible(false);
                  }}
                >
                  <View style={[styles.departmentColor, { backgroundColor: item.color }]}>
                    <DepartmentIcon department={item} size={24} color={COLORS.white} />
                  </View>
                  <Text style={styles.departmentOptionText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.pickerModalCloseButton}
              onPress={() => setIsVisible(false)}
            >
              <Text style={styles.pickerModalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};


// Main Home Component
const Home = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPost, setNewPost] = useState({
    department: '',
    title: '',
    content: '',
    imageUri:  null as string | null,
  });


  const handleLike = async (postId) => {
    try {
      const response = await axios.post(`${API_URL}/posts/${postId}/like`);
      // Update posts state with new like count
      setPosts(posts.map(post => 
        post._id === postId 
          ? { ...post, likes: response.data.reactions.likes }
          : post
      ));
    } catch (error) {
      Alert.alert('Error', 'Failed to like post. Please try again.');
    }
  };

  const handleDislike = async (postId) => {
    try {
      const response = await axios.post(`${API_URL}/posts/${postId}/dislike`);
      // Update posts state with new dislike count
      setPosts(posts.map(post => 
        post._id === postId 
          ? { ...post, dislikes: response.data.reactions.dislikes }
          : post
      ));
    } catch (error) {
      Alert.alert('Error', 'Failed to dislike post. Please try again.');
    }
  };

  const handleComment = (postId) => {
    // Navigate to comments screen or show comment modal
    Alert.alert('Coming Soon', 'Comments feature will be available soon!');
  };

  // Fetch posts from the backend
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/posts/display`);
      console.log("display");
      const transformedPosts = response.data.announcements.map(post => ({
        _id: post._id,
        department: post.department,
        title: post.title,
        content: post.message, // map message to content
        createdAt: post.createdAt,
        likes: post.reactions?.likes || 0,
        dislikes: post.reactions?.dislikes || 0,
        comments: post.reactions?.comments?.length || 0
      }));
      setPosts(transformedPosts);
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to fetch posts. Please check your connection and try again.',
        [{ text: 'Retry', onPress: fetchPosts }, { text: 'OK' }]
      );
      console.error('Fetch posts error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1200,
      maxHeight: 1200,
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

  const validatePost = () => {
    if (!newPost.department) {
      Alert.alert('Required Field', 'Please select a department.');
      return false;
    }
    if (!newPost.title.trim()) {
      Alert.alert('Required Field', 'Please enter a title.');
      return false;
    }
    if (!newPost.content.trim()) {
      Alert.alert('Required Field', 'Please enter content for your post.');
      return false;
    }
    return true;
  };

  const submitPost = async () => {
    if (!validatePost()) return;

    try {
      const formData = new FormData();
      formData.append('department', newPost.department);
      formData.append('title', newPost.title.trim());
      formData.append('content', newPost.content.trim());

      if (newPost.imageUri) {
        formData.append('image', {
          uri: newPost.imageUri,
          type: 'image/jpeg',
          name: `post_image_${Date.now()}.jpg`,
        });
      }

      const response = await axios.post(`${API_URL}/posts/create`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setPosts([response.data, ...posts]);
      setModalVisible(false);
      setNewPost({ department: '', title: '', content: '', imageUri: null });
      Alert.alert('Success', 'Your post has been published successfully.');
    } catch (error ) {
      Alert.alert(
        'Error',
        'Failed to submit post. Please try again.',
        [{ text: 'OK' }]
      );
      console.error('Post submission error:', error);
    }
  };
 
  const renderPostItem = ({ item }: { item: Post }) => {
    const department = DEPARTMENTS.find(d => d.name === item.department);

    console.log('Post Department:',item.department, department); 
    
    return (
      <View style={styles.postContainer}>
        <View style={styles.postHeader}>
          <View>
          {department && (
          <View style={styles.departmentInfo}>
            <DepartmentIcon 
              department={department} 
              size={29} 
            />
            <Text style={styles.departmentText}>
              {department.name}
            </Text>
            </View>
            )}
          </View>
             
        
          <Text style={styles.postDate}>
            {new Date(item.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        </View>
        
        <Text style={styles.postTitle}>{item.title}</Text>
        {item.imageUri && (
          <Image
            source={{ uri: item.imageUri }}
            style={styles.postImage}
            resizeMode="cover"
          />
        )}
        <Text style={styles.postContent}>{item.content}</Text>
        
        <View style={styles.postActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleLike(item._id)}
          >
            <Icon 
              name={item.hasLiked ? "thumbs-up" : "thumbs-up-outline"} 
              size={18} 
              color={item.hasLiked ? COLORS.secondary : COLORS.subtext} 
            />
            <Text style={styles.actionText}>{item.likes || 0}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleDislike(item._id)}
          >
            <Icon 
              name={item.hasDisliked ? "thumbs-down" : "thumbs-down-outline"} 
              size={18} 
              color={item.hasDisliked ? COLORS.error : COLORS.subtext} 
            />
            <Text style={styles.actionText}>{item.dislikes || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleComment(item._id)}
          >
            <Icon name="chatbubble-outline" size={18} color={COLORS.subtext} />
            <Text style={styles.actionText}>{item.comments || 0}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.secondary} style={styles.loader} />
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPostItem}
          keyExtractor={(item) => item._id}
          refreshing={isLoading}
          onRefresh={fetchPosts}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Icon name="documents-outline" size={48} color={COLORS.subtext} />
              <Text style={styles.emptyStateText}>
                No community posts yet.{'\n'}Be the first to share!
              </Text>
            </View>
          }
        />
      )}

      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Icon name="add" size={24} color={COLORS.white} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Post</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Icon name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <DepartmentPicker
              selectedDepartment={newPost.department}
              onSelect={(departmentId) =>
                setNewPost((prev) => ({ ...prev, department: departmentId }))
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Post Title"
              placeholderTextColor={COLORS.subtext}
              value={newPost.title}
              onChangeText={(text) => setNewPost((prev) => ({ ...prev, title: text }))}
              maxLength={100}
            />

            <TextInput
              style={[styles.input, styles.contentInput]}
              placeholder="Write your post content here..."
              placeholderTextColor={COLORS.subtext}
              value={newPost.content}
              onChangeText={(text) => setNewPost((prev) => ({ ...prev, content: text }))}
              multiline
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={styles.imageUploadButton}
              onPress={handleImageUpload}
            >
              <Icon name="image-outline" size={24} color={COLORS.secondary} />
              <Text style={styles.imageUploadText}>
                {newPost.imageUri ? 'Change Image' : 'Add Image'}
              </Text>
            </TouchableOpacity>

            {newPost.imageUri && (
              <View style={styles.imagePreviewContainer}>
                <Image
                  source={{ uri: newPost.imageUri }}
                  style={styles.imagePreview}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => setNewPost((prev) => ({ ...prev, imageUri: null }))}
                >
                  <Icon name="close-circle" size={24} color={COLORS.error} />
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={styles.submitButton}
              onPress={submitPost}
            >
              <Text style={styles.submitButtonText}>Publish Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Home;