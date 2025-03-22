import React, { useState, useEffect,useContext } from 'react';
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
import { PermissionsAndroid} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { API_URL } from '@/constants/constants';
import WeatherCard from '../../components/WeatherCard'; // Adjust path as needed
import { WeatherContext } from './_layout'; // Adjust path to match your file structure
import styles from "./Styles/homestyle";
import { launchImageLibrary, ImageLibraryOptions, MediaType, ImagePickerResponse } from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';
import { Linking } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
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
  textLight: '#546E7A',
};

// Define the type for your navigation stack
type HomeStackParamList = {
  Home: undefined; // No parameters expected for the Home screen
  ImportResident: undefined; // No parameters expected for the ImportResident screen
};

// Define the type for the navigation prop
type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, "Home">;

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

  const handlePress = () => {
    navigation.navigate('Weather'); // Navigate to screen named "Weather"
  };

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


// Comment Modal Component
const CommentModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  postId: string;
  comments: Comment[];
  onAddComment: (comment: string) => Promise<void>;
}> = ({ visible, onClose, postId, comments, onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onAddComment(newComment.trim());
      setNewComment('');
    } catch (error) {
      Alert.alert('Error', 'Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <View style={styles.commentHeader}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.commentTime}>
          {new Date(item.createdAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
      </View>
      <Text style={styles.commentMessage}>{item.message}</Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.commentModalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Comments</Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
              <Icon name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={comments}
            renderItem={renderComment}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.commentsList}
            ListEmptyComponent={
              <View style={styles.emptyComments}>
                <Icon name="chatbubbles-outline" size={48} color={COLORS.subtext} />
                <Text style={styles.emptyCommentsText}>No comments yet. Be the first to comment!</Text>
              </View>
            }
          />

          <View style={styles.commentInput}>
            <TextInput
              style={styles.commentTextInput}
              placeholder="Write a comment..."
              placeholderTextColor={COLORS.subtext}
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />
            <TouchableOpacity
              style={[
                styles.commentSubmitButton,
                (!newComment.trim() || isSubmitting) && styles.commentSubmitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={!newComment.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Icon name="send" size={20} color={COLORS.white} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};


// Main Home Component
const Home = () => {
  
  const navigation = useNavigation();
  const { weatherData } = useContext(WeatherContext);
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
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

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

  const handleComment = (postId: string) => {
    console.log("postId:", postId);
    console.log("Request URL:", `${API_URL}/posts/${postId}/addcomments`);

    setSelectedPostId(postId);
    setCommentModalVisible(true);
  };

  const handleAddComment = async (postId: string, message: string) => {
    console.log( "postID" ,postId  );
    console.log("message",message);
    try {
      const response = await axios.post(`${API_URL}/posts/${postId}/comments`, {
        username: 'Sreekrishnapuram', // Replace with actual username
        message
      });
      console.log(response);
      // Update local state with new comment
      setPosts(posts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            reactions: {
              ...post.reactions,
              comments: [...post.reactions.comments, response.data]
            }
          };
        }
        return post;
      }));

      return response.data;
    } catch (error) {
      console.error('Add comment error:', error);
      throw error;
    }
  };

  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Camera roll permission is required!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImageUploading(true); // Start loading indicator
      const imageUrl = await uploadToCloudinary(result.assets[0].uri); // Upload image and get URL
      setNewPost((prev) => ({ ...prev, imageUri: imageUrl })); // Update newPost with the image URL
      setImageUploading(false); // Stop loading indicator
    }
  };
  const uploadToCloudinary = async (uri: string) => {
    try {
      // Create the FormData object for the image
      const imagedata = new FormData();
  
      // Extract the file name and type from the URI
      const filename = uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename || '');
      const type = match ? `image/${match[1]}` : 'image/jpeg';
  
      // Append the file data in the correct format for React Native
      imagedata.append('file', {
        uri,
        name: filename || 'upload.jpg',
        type,
      }as any);
  
      // Append the upload preset
      imagedata.append('upload_preset', 'post_images');
  
      // Make the request to Cloudinary
      const uploadResponse = await axios.post(
        'https://api.cloudinary.com/v1_1/dnwlvkrqs/image/upload',
        imagedata,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      // Get the secure URL of the uploaded image
      const imageUrl = uploadResponse.data.secure_url;
      console.log('Uploaded:', imageUrl);
      
      return imageUrl; // Return the image URL
      
    } catch (error) {
      console.error('Cloudinary upload failed:', error);
      Alert.alert('Upload Failed', 'Could not upload the image. Please try again.');
    }
  };
 

  const handleDeletePost = async (postId: string) => {
    try {
      // Confirm deletion with the user
      Alert.alert(
        'Delete Post',
        'Are you sure you want to delete this post?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', onPress: async () => {
            console.log(postId);
            // Call the API to delete the post
            await axios.delete(`${API_URL}/posts/delete/${postId}`);
            
            // Remove the post from the local state
            setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
            
            Alert.alert('Success', 'Post deleted successfully.');

            fetchPosts();
          }},
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to delete the post. Please try again.');
      console.error('Delete post error:', error);
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
          access: ["sreekrishnapuram"] ,
        };

        console.log("Before Submitting post:", postData); // Debugging

        const response = await axios.post(`${API_URL}/posts/create`, postData);
        console.log('After Post submission response:', response.data);
        
        fetchPosts();

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

    const formattedDate = new Date(item.createdAt).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

      // Update your share function to use proper typing
      const shareToWhatsApp = async (item: Post) => {
        try {
          // Get department name
          const departmentName = DEPARTMENTS.find(d => d.name === item.department)?.name || "Department not specified";
          
          // Format date nicely
          const formattedDate = new Date(item.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
          
          // Create comprehensive formatted message
          const message = 
            `*${item.title}*\n\n` +
            ` *${departmentName}\n` +
            `*Date:* ${formattedDate}\n\n` +
            `${item.message}\n\n` + 
            (item.imageUri ? `*Image:* ${item.imageUri}\n\n` : "") +
            "Shared from Populus App";
          
          // For WhatsApp sharing via Linking (no need for RNShare)
          const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;
          
          const canOpen = await Linking.canOpenURL(whatsappUrl);
          if (canOpen) {
            await Linking.openURL(whatsappUrl);
          } else {
            Alert.alert("WhatsApp not installed", "Please install WhatsApp to share content.");
          }
        } catch (error) {
          console.error('Error sharing:', error);
          Alert.alert(
            'Sharing Failed',
            'Could not share this post to WhatsApp. Please try again later.'
          );
        }
      };
    
    return (
      <View style={styles.postContainer}>
        <View style={styles.postHeader}>
          <View style={styles.headerContent}>
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
          
          <Text style={styles.postDate}>
            {new Date(item.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>
        
         {/* Add Delete Icon */}
         <TouchableOpacity
          onPress={() => handleDeletePost(item._id)}
          style={styles.deleteButton}
        >
          <Icon name="trash-outline" size={20} color={COLORS.error} />
        </TouchableOpacity>
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

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => shareToWhatsApp(item)}
          >
            <Icon name="logo-whatsapp" size={20} color="#25D366" />
            <Text style={styles.actionText}>WhatsApp</Text>
          </TouchableOpacity>
        </View>
        {selectedPostId === item._id && (
          <CommentModal
            visible={commentModalVisible}
            onClose={() => setCommentModalVisible(false)}
            postId={item._id}
            comments={item.reactions.comments}
            onAddComment={(message) => handleAddComment(item._id, message)}
          />
        )}
      </View>
    );
  };

  const renderHeader = () => (
    <View>
      <WeatherCard/>
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <TouchableOpacity
      onPress={() => {
        console.log("Navigating to ImportResident"); // Debugging
        navigation.navigate("ImportResident");
      }}
    >
      <Text>Go to Import Resident</Text>
    </TouchableOpacity>

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
          ListHeaderComponent={renderHeader}
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

{newPost.imageUri ? (
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
) : (
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
        <Text style={styles.imageUploadText}>Add Image</Text>
      </>
    )}
  </TouchableOpacity>
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