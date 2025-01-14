import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { API_URL } from '@/constants/constants';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

const UnverifiedUsers = () => {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();

  const fetchUnverifiedUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/government/users`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching unverified users:', error);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button title="Refresh" onPress={fetchUnverifiedUsers} color="#007AFF" />
      ),
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      fetchUnverifiedUsers();
    }, [])
  );

  

  const handleVerify = async (user) => {
    try {
      const response = await fetch(`${API_URL}/government/verify-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user, presidentId: 'swarim' }), // Add presidentId
      });

      if (!response.ok) {
        throw new Error('Failed to verify user.');
      }

      Alert.alert('Success', `${user.name} has been verified.`);
      setUsers(users.filter((u) => u._id !== user._id)); // Remove verified user from the list
    } catch (error) {
      console.error('Error verifying user:', error);
      Alert.alert('Error', 'Failed to verify the user.');
    }
  };

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/government/delete-user/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user.');
      }

      Alert.alert('Success', 'User has been deleted.');
      setUsers(users.filter((u) => u._id !== userId)); // Remove deleted user from the list
    } catch (error) {
      console.error('Error deleting user:', error);
      Alert.alert('Error', 'Failed to delete the user.');
    }
  };

  return (
    
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Text style={styles.text}>Name: {item.name}</Text>
            <Text style={styles.text}>DOB: {item.dateOfBirth}</Text>
            <Text style={styles.text}>Gender: {item.gender}</Text>
            <Button title="Verify" onPress={() => handleVerify(item)} />
            <Button title="Delete" onPress={() => handleDelete(item._id)} color="red" />
          </View>
        )}
        ListEmptyComponent={<Text>No unverified users found.</Text>}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  userCard: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
  },
  text: { fontSize: 16, marginBottom: 5 },
});

export default UnverifiedUsers;
