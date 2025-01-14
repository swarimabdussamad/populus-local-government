import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList } from 'react-native';

const UnverifiedUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('${API_URL}/government/unverified-users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(error => console.error(error));
  }, []);

  return (
    <View>
      <FlatList
        data={users}
        keyExtractor={(item) => item.username}
        renderItem={({ item }) => (
          <View>
            <Text>Name: {item.name}</Text>
            <Button title="Verify" />
          </View>
        )}
      />
    </View>
  );
};

export default UnverifiedUsers;
