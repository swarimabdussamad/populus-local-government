import { View, Text } from 'react-native';
import React from 'react';
import { Foundation, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Importing your screens
import Home from "@/app/(tabs)/home";
import Message from "@/app/(tabs)/message";
import Map from "@/app/(tabs)/map";
import Survey from "@/app/(tabs)/survey";
import Users from "@/app/(tabs)/users"; // Importing the new users screen

const Tab = createBottomTabNavigator();

// Tab configuration for each screen
const tabConfig = [
  {
    name: "home",
    component: Home,
    focusedIcon: 'home',
    unfocusedIcon: 'home',
    iconComponent: Foundation
  },
  {
    name: "Map",
    component: Map,
    focusedIcon: 'home-map-marker',
    unfocusedIcon: 'home-map-marker',
    iconComponent: MaterialCommunityIcons
  },
  {
    name: "Survey",
    component: Survey,
    focusedIcon: 'google-analytics',
    unfocusedIcon: 'google-analytics',
    iconComponent: MaterialCommunityIcons
  },
  {
    name: "Message",
    component: Message,
    focusedIcon: 'message-text',
    unfocusedIcon: 'message-text',
    iconComponent: MaterialCommunityIcons
  },
  {
    name: "Users", // Adding the Users tab
    component: Users, // Your users.tsx component
    focusedIcon: 'user', // Icon for focused state
    unfocusedIcon: 'user', // Icon for unfocused state
    iconComponent: Feather // Icon library for the user icon
  }
];

const TabLayout = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        // Find the config for the current route
        const routeConfig = tabConfig.find(config => config.name === route.name);
        const iconName = routeConfig ? (routeConfig.focusedIcon) : '';
        const IconComponent = routeConfig ? routeConfig.iconComponent : MaterialCommunityIcons;

        return {
          tabBarIcon: ({ focused, color, size }) => {
            const icon = focused ? iconName : routeConfig?.unfocusedIcon;
            return <IconComponent name={icon} size={size} color={color} />;
          },
          headerTitleAlign: "center",
          tabBarStyle: {
            backgroundColor: '#161622'
          }
        };
      }}
    >
      {/* Mapping Tab Screens */}
      {tabConfig.map(tab => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{ headerTitleAlign: "center" }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default TabLayout;
