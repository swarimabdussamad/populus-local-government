import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Foundation, MaterialCommunityIcons,Feather,Ionicons } from "@expo/vector-icons";

// Import your screens
import Home from "@/app/(tabs)/home";
import Weather from "@/app/(tabs)/weatherscreen";
import Map from "@/app/(tabs)/map";
import SurveyList from "@/app/(tabs)/survey/SurveyList";
import NewSurvey from "@/app/(tabs)/survey/NewSurvey";
import Users from "@/app/(tabs)/users";
import Profile from '@/app/(tabs)/profile';
const Tab = createBottomTabNavigator();
const SurveyStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();

// Survey Stack Navigator
const SurveyStackNavigator = () => {
  return (
    <SurveyStack.Navigator>
      <SurveyStack.Screen
        name="SurveyList"
        component={SurveyList}
        options={{ title: "Surveys" }}
        
      />
      <SurveyStack.Screen
        name="NewSurvey"
        component={NewSurvey}
        options={{ title: "Create New Survey" }}
        
      />
    </SurveyStack.Navigator>
  );
};
const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={Home}
        options={{ title: "Home" }}
      />
      <HomeStack.Screen
        name="Weather"
        component={Weather}
        options={{ title: "Weather Forecast " }}
        
      />
    </HomeStack.Navigator>
  );
};

// Tab configuration
const TabLayout = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: { backgroundColor: "#161622" },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#888",
        headerTitleAlign: "center",
        
        
        
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Foundation name="home" color={color} size={size} />
          ), 
        }}
      />
      <Tab.Screen
        name="Map"
        component={Map}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home-map-marker"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Survey"
        component={SurveyStackNavigator} // Use Survey Stack here
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="clipboard-text-outline"
              color={color}
              size={size}
            />
          ), 
        }}
      />
      <Tab.Screen
        name="Users"
        component={Users}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="user-check" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabLayout;
