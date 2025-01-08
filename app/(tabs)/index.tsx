import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Foundation, MaterialCommunityIcons } from '@expo/vector-icons';
import Home from "@/app/(tabs)/home";
import Message from "@/app/(tabs)/message";
import Map from "@/app/(tabs)/map";
import Survey from "@/app/(tabs)/survey";

// Define Tab Param Types
type TabParamList = {
  Map: undefined;
  home: undefined;
  Survey: undefined;
  Message: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

// Tab configuration
const tabConfig = [
  {
    name: "Map",
    component: Map,
    focusedIcon: 'home-map-marker',
    unfocusedIcon: 'home-map-marker',
    iconComponent: MaterialCommunityIcons,
  },
  {
    name: "home",
    component: Home,
    focusedIcon: 'home',
    unfocusedIcon: 'home',
    iconComponent: Foundation,
  },
  {
    name: "Survey",
    component: Survey,
    focusedIcon: 'google-analytics',
    unfocusedIcon: 'google-analytics',
    iconComponent: MaterialCommunityIcons,
  },
  {
    name: "Message",
    component: Message,
    focusedIcon: 'message-text',
    unfocusedIcon: 'message-text',
    iconComponent: MaterialCommunityIcons,
  },
];

// Function to define common screen options
const getScreenOptions = (routeName: string) => {
  const routeConfig = tabConfig.find(config => config.name === routeName);
  if (!routeConfig) return {};

  const { focusedIcon, unfocusedIcon, iconComponent: IconComponent } = routeConfig;

  return {
    tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
      const iconName = focused ? focusedIcon : unfocusedIcon;
      return <IconComponent name={iconName} size={size} color={color} />;
    },
    headerTitleAlign: "center",
    tabBarStyle: {
      backgroundColor: '#161622',
    },
  };
};

// Main Tab Layout Component
const TabLayout: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="home" // Set Home as default screen
      screenOptions={({ route }) => getScreenOptions(route.name)}
    >
      {tabConfig.map(tab => (
        <Tab.Screen
          key={tab.name}
          name={tab.name as keyof TabParamList}
          component={tab.component}
          options={{ headerTitleAlign: "center" }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default TabLayout;
