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
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
 // For icons

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [attachment, setAttachment] = useState(null);

  // Function to handle posting a new post
  const handlePost = () => {
    const post = {
      id: Date.now(),
      name: 'You',
      avatar: require('../../assets/images/01.jpg'), // Replace with your avatar image path
      message: newPost,
      time: new Date().toLocaleTimeString(),
      attachment,
    };
    setPosts([post, ...posts]);
    setNewPost('');
    setAttachment(null);
    setModalVisible(false);
  };

  // Function to delete a post by its ID
  const handleDeletePost = (postId) => {
    setPosts(posts.filter((post) => post.id !== postId));
  };

  // Render a single post
  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      {/* Delete Icon */}
      <TouchableOpacity
        style={styles.deleteIcon}
        onPress={() => handleDeletePost(item.id)}
      >
        <Icon name="trash-outline" size={20} color="#ff5555" />
      </TouchableOpacity>

      {/* Avatar and Post Content */}
      <Image source={item.avatar} style={styles.avatar} />
      <View style={styles.postContent}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>{item.time}</Text>
        {item.attachment && <Image source={item.attachment} style={styles.attachment} />}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Weather Header */}
      <View style={styles.weatherContainer}>
        <Text style={styles.weatherText}>19°</Text>
        <Text style={styles.cityText}>Montreal, Canada</Text>
      </View>

      {/* Posts */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
      />

      {/* Floating Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>

      {/* Post Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          {/* Close Icon */}
          <TouchableOpacity
            style={styles.closeIcon}
            onPress={() => setModalVisible(false)}
          >
            <Icon name="close-outline" size={30} color="#000" />
          </TouchableOpacity>

          <Image source={require('../../assets/images/01.jpg')} style={styles.avatar} />
          <Text style={styles.name}>You</Text>

          <TextInput
            style={styles.textInput}
            placeholder="Type here..."
            value={newPost}
            onChangeText={setNewPost}
          />

          <Button
            title="Upload Attachment"
            onPress={() => setAttachment(require('../../assets/images/01.jpg'))} // Mock attachment
          />

          <TouchableOpacity style={styles.postButton} onPress={handlePost}>
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  weatherContainer: { padding: 20, alignItems: 'center' },
  weatherText: { fontSize: 50, fontWeight: 'bold' },
  cityText: { fontSize: 18, color: '#555' },
  postContainer: { 
    flexDirection: 'row', 
    padding: 15, 
    borderBottomWidth: 1, 
    borderColor: '#ccc',
    alignItems: 'center',
    position: 'relative',
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  postContent: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold' },
  message: { fontSize: 14, color: '#333' },
  time: { fontSize: 12, color: '#999' },
  attachment: { width: 100, height: 100, marginTop: 10 },
  deleteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007bff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButtonText: { fontSize: 30, color: '#fff', fontWeight: 'bold' },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  closeIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  textInput: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  postButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 15,
  },
  postButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default HomeScreen;
