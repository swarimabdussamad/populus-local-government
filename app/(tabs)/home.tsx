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

import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { API_URL } from '@/constants/constants';
import styles from "./Styles/homestyle";
import { launchImageLibrary, ImageLibraryOptions, MediaType, ImagePickerResponse } from 'react-native-image-picker';


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
    id: 1, 
    name: 'Local Government', 
    color: '#3498DB',
    icon: 'account-balance',  // ✅ MaterialIcons
    iconFamily: 'MaterialIcons'
  },
  { 
    id: 2, 
    name: 'Health Department', 
    color: '#2ECC71',
    icon: 'local-hospital',  // ✅ MaterialIcons
    iconFamily: 'MaterialIcons'
  },
  { 
    id: 3, 
    name: 'Police Department', 
    color: '#34495E',
    icon: 'police-badge',  // ✅ MaterialCommunityIcons
    iconFamily: 'MaterialCommunityIcons'
  },
  { 
    id: 4, 
    name: 'Fire Department', 
    color: '#E74C3C',
    icon: 'fire-truck',  // ✅ MaterialCommunityIcons
    iconFamily: 'MaterialCommunityIcons'
  },
  { 
    id: 5, 
    name: 'Education Department', 
    color: '#9B59B6',
    icon: 'school',  // ✅ MaterialIcons
    iconFamily: 'MaterialIcons'
  },
  { 
    id: 6, 
    name: 'Transportation Department', 
    color: '#F1C40F',
    icon: 'bus',  // ✅ MaterialCommunityIcons
    iconFamily: 'MaterialCommunityIcons'
  },
  { 
    id:7, 
    name: 'Environmental Department', 
    color: '#16A085',
    icon: 'leaf',  // ✅ MaterialCommunityIcons
    iconFamily: 'MaterialCommunityIcons'
  },
  { 
    id: 8, 
    name: 'Social Services', 
    color: '#E67E22',
    icon: 'account-group',  // ✅ MaterialCommunityIcons
    iconFamily: 'MaterialCommunityIcons'
  },
];


type Department = {
  id: number;
  name: string;
  color: string;
  icon: string;
  iconFamily: 'MaterialIcons'|'MaterialCommunityIcons';
};


interface Comment {
  username: string;
  message: string;
  createdAt: Date;
}


interface Post {
  _id: string;
  department: string;
  time: Date;
  title: string;
  message: string;
  imageUri?: string; 
  reactions: {
    likes: number;
    dislikes: number;
    comments: Comment[];
  };
  createdAt: Date;
  userReaction?: 'like' | 'dislike' | null;
}
interface UserReaction {
  userId: string;
  reaction: 'like' | 'dislike';
}
interface NewPost {
  department: string;
  title: string;
  message: string;
  imageUri: string | null;
}
const options: ImageLibraryOptions = {
  mediaType: 'photo' as MediaType,
  quality: 0.8,
  maxWidth: 1200,
  maxHeight: 1200,
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
  const selectedDept = DEPARTMENTS.find((d) => d.name === selectedDepartment);;

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
              
              keyExtractor={(item, index) => `${item}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.departmentOption}
                  onPress={() => {
                    onSelect(item.name);
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
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [newPost, setNewPost] = useState({
    department: '',
    title: '',
    message: '',
    imageUri:  null as string | null,
  });

  // Fetch posts from the backend
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/posts/display`);
      console.log("display");
      console.log("DEPARTMENTS Data:", DEPARTMENTS.map((d) => d.id));

      const transformedPosts = response.data.announcements.map((post : any ) => ({
        _id: post._id,
        department: post.department,
        time: new Date(post.time),
        title: post.title,
        message: post.message,
        imageUri: post.imageUri,
        reactions: {
          likes: post.reactions?.likes || 0,
          dislikes: post.reactions?.dislikes || 0,
          comments: post.reactions?.comments || []
        },
        createdAt: new Date(post.createdAt),
        hasLiked: false,
        hasDisliked: false
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

  const handleReaction = async (postId: string, type: 'like' | 'dislike') => {
    try {
      const userId = 'current-user-id';
      const response = await axios.post(`${API_URL}/posts/${postId}/reaction`, {
        userId,
        type
      });

      //const response = await axios.post(`${API_URL}/posts/${postId}/${type}`);
      //const updatedReaction = type === 'like' ? { likes: response.data.reactions.likes } : { dislikes: response.data.reactions.dislikes };

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId 
            ? {
                ...post,
                reactions: {
                  ...post.reactions,
                  likes: response.data.reactions.likes,
                  dislikes: response.data.reactions.dislikes
                },
                userReaction: response.data.userReaction
              }
            : post
        )
      );
    } catch (error) {
      Alert.alert('Error', `Failed to ${type} post. Please try again.`);
    }
  };

  const handleLike = (postId: string) => handleReaction(postId, 'like');
  const handleDislike = (postId: string) => handleReaction(postId, 'dislike');


  const handleComment = (postId: string) => {
    // Navigate to comments screen or show comment modal
    Alert.alert('Coming Soon', 'Comments feature will be available soon!');
  };


  const uploadToCloudinary = async (uri: string): Promise<string | null> => {
    try {
      setImageUploading(true);
      const imageData = new FormData();
      
      // Extract filename and type
      const filename = uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename || '');
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      
      // Append image file
      imageData.append('file', {
        uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
        name: filename || 'upload.jpg',
        type,
      } as any);
      
      // Add upload preset
      imageData.append('upload_preset', 'profilepic');
      
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dnwlvkrqs/image/upload',
        imageData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response.data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload failed:', error);
      Alert.alert('Upload Failed', 'Could not upload the image. Please try again.');
      return null;
    } finally {
      setImageUploading(false);
    }
  };


  const handleImageUpload = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo' as MediaType,
      quality: 0.8,
      maxWidth: 1200,
      maxHeight: 1200,
    };
    

    try {
      const response = await new Promise<ImagePickerResponse>((resolve) => {
        launchImageLibrary(options, resolve);
      });

      if (response.didCancel) {
        console.log('User cancelled image picker');
        return;
      }

      if (response.errorCode) {
        console.log('Image picker error: ', response.errorMessage);
        return;
      }

      if (!response.assets || response.assets.length === 0) {
        console.log('No assets selected');
        return;
      }

      const asset = response.assets[0];
      if (asset && asset.uri) {
        const cloudinaryUrl = await uploadToCloudinary(asset.uri);
        if (cloudinaryUrl) {
          setNewPost((prev) => ({
            ...prev,
            imageUri: cloudinaryUrl,
          }));
        }
      }
    } catch (error) {
      console.error('Image upload error:', error);
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    }
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
    if (!newPost.message.trim()) {
      Alert.alert('Required Field', 'Please enter content for your post.');
      return false;
    }
    return true;
  };

  const submitPost = async () => {
    if (!validatePost()) return;

      try {
        const postData = {
          department: newPost.department,
          title: newPost.title.trim(),
          message: newPost.message.trim(),
          imageUri: newPost.imageUri,
        };

        //console.log("Submitting post:", Object.fromEntries(postData.entries())); // Debugging

        const response = await axios.post(`${API_URL}/posts/create`, postData);
        console.log('Post submission response:', response.data);
        
        const newPostData = response.data;
        setPosts((prevPosts) => [{
          _id: newPostData._id,
          department: newPostData.department,
          time: new Date(newPostData.time),
          title: newPostData.title,
          message: newPostData.message,
          imageUri: newPostData.imageUri, 
          reactions: {
            likes: 0,
            dislikes: 0,
            comments: []
          },
          createdAt: new Date(newPostData.createdAt),
          hasLiked: false,
          hasDisliked: false
        }, ...prevPosts]);
        setModalVisible(false);
        setNewPost({ department: '', title: '', message: '', imageUri: null });
        Alert.alert('Success', 'Your post has been published successfully.');
    }catch (error :any) {
      Alert.alert(
        'Error',
        `Failed to submit post. ${error.response?.data?.message || 'Please try again.'}`,
        [{ text: 'OK' }]
      );
      console.error('Post submission error:', error);
    }
  };
 
  const renderPostItem = ({ item }: { item: Post }) => {
    const department = DEPARTMENTS.find(d => d.name === item.department);

    
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
        <Text style={styles.postContent}>{item.message}</Text>
        
        <View style={styles.postActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleReaction(item._id,'like')}
          >
             <Icon 
            name={item.userReaction === 'like' ? "thumbs-up" : "thumbs-up-outline"} 
            size={18} 
            color={item.userReaction === 'like' ? COLORS.secondary : COLORS.subtext} 
          />
            <Text style={styles.actionText}>{item.reactions.likes}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleReaction(item._id,'dislike')}
          >
            <Icon 
            name={item.userReaction === 'dislike' ? "thumbs-down" : "thumbs-down-outline"} 
            size={18} 
            color={item.userReaction === 'dislike' ? COLORS.error : COLORS.subtext} 
          />
            <Text style={styles.actionText}>{item.reactions.dislikes }</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleComment(item._id)}
          >
            <Icon name="chatbubble-outline" size={18} color={COLORS.subtext} />
            <Text style={styles.actionText}>{item.reactions.comments.length}</Text>
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
              value={newPost.message}
              onChangeText={(text) => setNewPost((prev) => ({ ...prev, message: text }))}
              multiline
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={styles.imageUploadButton}
              onPress={handleImageUpload}
              disabled={imageUploading}
            >
              {imageUploading ? (
              <ActivityIndicator size="small" color={COLORS.secondary} />
            ) : (
              <>
                <Icon name="image-outline" size={24} color={COLORS.secondary} />
                <Text style={styles.imageUploadText}>
                  {newPost.imageUri ? 'Change Image' : 'Add Image'}
                </Text>
              </>
            )}
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