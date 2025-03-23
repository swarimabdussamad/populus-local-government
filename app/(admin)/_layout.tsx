import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomDrawerContent from '../../components/CustomDrawer'; // Ensure correct path
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { router } from 'expo-router';

const AdminLayout = () => {
  const handleLogout = () => {
    console.log('Logout clicked');
    // Add any logout logic here (e.g., clear authentication state)
    router.push('/(login)/login');
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerStyle: {
            width: 240, // Adjust drawer width
          },
          drawerActiveTintColor: '#1b1b7e', // Active item color
          drawerInactiveTintColor: '#666', // Inactive item color
        }}
      >
        {/* Dashboard Screen */}
        <Drawer.Screen
          name="dashboard"
          options={{
            headerShown: true,
            headerTitle: 'Dashboard',
            drawerLabel: 'Dashboard',
            headerRight: () => (
              <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
                <Ionicons name="log-out-outline" size={24} color="#1b1b7e" />
              </TouchableOpacity>
            ),
          }}
        />

        {/* Add Local Government Screen */}
        <Drawer.Screen
          name="addLocal"
          options={{
            headerShown: true,
            headerTitle: 'Add Local Government',
            drawerLabel: 'Add Local Government',
          }}
        />

        {/* Add Department Screen */}
        <Drawer.Screen
          name="addDept"
          options={{
            headerShown: true,
            headerTitle: 'Add Department',
            drawerLabel: 'Add Department',
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};

export default AdminLayout;