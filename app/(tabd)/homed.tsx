import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import styles from './Styles/shome'
import { API_URL } from '@/constants/constants';

// Interfaces for props
interface Post {
  id: string;
  department: string;
  time: string;
  title: string;
  message: string;
  reactions: {
    likes: number;
    dislikes: number;
    comments: any[];
  };
  createdAt?: string;
}

interface PostTypeModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectType: (type: 'announcement' | 'alert') => void;
}

interface PostModalProps {
  visible: boolean;
  onClose: () => void;
  postType: 'announcement' | 'alert';
  onSubmit: (postData: {
    department: string;
    time: string;
    title: string;
    message: string;
    reactions: {
      likes: number;
      dislikes: number;
      comments: [];
    };
  }) => void;
}

const WeatherCard = () => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('Weather'); // Navigate to screen named "Weather"
  };

  return (
    <TouchableOpacity 
      style={styles.weatherCard}
      onPress={handlePress}
    >
      <View style={styles.weatherContent}>
        <View style={styles.weatherLeft}>
          <Text style={styles.weatherTemp}>11°</Text>
          <Text style={styles.weatherLocation}>Montreal, Canada</Text>
        </View>
        <View style={styles.weatherRight}>
          <MaterialCommunityIcons
            name="weather-partly-cloudy"
            size={40}
            color="#666"
          />
          <Text style={styles.weatherCondition}>Partly Cloudy</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const PostTypeModal: React.FC<PostTypeModalProps> = ({
  visible,
  onClose,
  onSelectType,
}) => (
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

const PostModal: React.FC<PostModalProps> = ({
  visible,
  onClose,
  postType,
  onSubmit,
}) => {
  const [department, setDepartment] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
   
  
  const handleSubmit = () => {
    onSubmit({
      department,
      time: new Date().toISOString(),
      title,
      message,
      reactions: { likes: 0, dislikes: 0, comments: [] },
    });
    setDepartment('');
    setTitle('');
    setMessage('');
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
              !(department && title && message) && styles.postModalSubmitDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!(department && title && message)}
          >
            <Text style={styles.postModalSubmitText}>Post</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.postModalContent}>
          <Picker
            selectedValue={department}
            style={styles.input}
            onValueChange={(itemValue) => setDepartment(itemValue)}
          >
            <Picker.Item label="Select Department" value="" />
            <Picker.Item label="Health Department" value="Health Department" />
            <Picker.Item label="Police Department" value="Police Department" />
            <Picker.Item label="Local Government" value="Local Government" />
          </Picker>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Message"
            value={message}
            onChangeText={setMessage}
            multiline
          />
        </View>
      </View>
    </Modal>
  );
};



const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postTypeModalVisible, setPostTypeModalVisible] = useState(false);
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [selectedPostType, setSelectedPostType] = useState<'announcement' | 'alert'>(
    'announcement'
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handlePostTypeSelect = (type: 'announcement' | 'alert') => {
    setPostTypeModalVisible(false);
    setSelectedPostType(type);
    setPostModalVisible(true);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/posts/display`);
        
        // Ensure the response is okay
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
  
        // // Validate that the data is an array
        // if (data && Array.isArray(data.announcements)) {
        //   setPosts(data.announcements);
        // } else {
        //   console.error('Fetched data is not an array:', data);
        //   setPosts([]); // Set to an empty array if the data format is unexpected
        // }
        const processedPosts = data.announcements.map(post => ({
          ...post,
          reactions: post.reactions || { 
            likes: 0, 
            dislikes: 0, 
            comments: [] 
          }
        }));
  
        setPosts(processedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]); // Set to an empty array in case of an error
      }
    };
  
    fetchPosts();
  }, []);
  
  

  


  const handlePostSubmit = async (postData: Omit<Post, 'id'>) => {
    try {
      const response = await fetch(`${API_URL}/posts/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });
      const newPost = await response.json();
      setPosts((prevPosts) => [newPost, ...prevPosts]);
      setPostModalVisible(false);
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${API_URL}/posts/delete/${id}`, { method: 'DELETE' });
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const renderPost = ({ item }: { item: Post }) => {
    
    const reactions = item.reactions || { 
      likes: 0, 
      dislikes: 0, 
      comments: [] 
    };
  

    const getDepartmentIcon = (department: string) => {
      switch (department) {
        case 'Health Department':
          return <MaterialCommunityIcons name="hospital" size={24} color="#00b894" />;
        case 'Police Department':
          return <MaterialCommunityIcons name="police-badge" size={24} color="#0984e3" />;
        case 'Local Government':
          return <MaterialCommunityIcons name="city" size={24} color="#e17055" />;
        default:
          return <MaterialCommunityIcons name="help-circle" size={24} color="#d63031" />;
      }
    };
    const handleReaction = (type: 'like' | 'dislike') => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === item.id
            ? {
                ...post,
                reactions: {
                  ...post.reactions,
                  likes: type === 'like' ? (post.reactions.likes || 0) + 1 : post.reactions.likes || 0,
                  dislikes: type === 'dislike' ? (post.reactions.dislikes || 0) + 1 : post.reactions.dislikes || 0,
                },
              }
            : post
        )
      );
    };

    return (
      <View style={styles.postContainer}>
        <View style={styles.postHeader}>
          {getDepartmentIcon(item.department)}
          <Text style={styles.postDepartment}>{item.department}</Text>
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            style={styles.deleteButton}
          >
            <MaterialCommunityIcons name="delete" size={24} color="#f44336" />
          </TouchableOpacity>


        </View>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postContent}>{item.message}</Text>
        <Text style={styles.postTimestamp}>
          {item.createdAt
            ? new Date(item.createdAt).toLocaleString()
            : 'Date not available'}
        </Text>
        <View style={styles.reactionsContainer}>
        <TouchableOpacity
          style={styles.reactionButton}
          onPress={() => handleReaction('like')}
        >
          <MaterialCommunityIcons name="thumb-up" size={20} color="#4caf50" />
          <Text style={styles.reactionText}>{item.reactions.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.reactionButton}
          onPress={() => handleReaction('dislike')}
        >
          <MaterialCommunityIcons name="thumb-down" size={20} color="#f44336" />
          <Text style={styles.reactionText}>{item.reactions.dislikes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reactionButton}>
          <MaterialCommunityIcons name="comment" size={20} color="#2196f3" />
          <Text style={styles.reactionText}>{item.reactions.comments.length}</Text>
        </TouchableOpacity>
        
      </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <WeatherCard />

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
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



export default Home;
  