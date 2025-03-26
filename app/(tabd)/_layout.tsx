import React, { createContext, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Foundation, MaterialCommunityIcons, Feather, Ionicons } from "@expo/vector-icons";

// Import your screens
import Map from "@/app/(tabd)/map";
import HouseDetails from '@/app/(tabd)/HouseDetails'; // Adjust the path if needed
import SurveyList from "@/app/(tabd)/survey/SurveyListd";
import NewSurvey from "@/app/(tabd)/survey/NewSurveyd";
import Profile from "@/app/(tabd)/profiled";
import HomeDepartment from "./homed";
import SurveyResults from "./survey/SurveyResultd";
import Weather from "@/app/(tabd)/weatherscreen";

export const WeatherContext = createContext(null)

const Tab = createBottomTabNavigator();
const SurveyStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const MapStack = createNativeStackNavigator();

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
        name="SurveyResults"
        component={SurveyResults}
        options={{ title: "result" }}
      />
      <SurveyStack.Screen
        name="NewSurvey"
        component={NewSurvey}
        options={{ title: "Create New Survey" }}
      />
    </SurveyStack.Navigator>
  );
};

// Home Stack Navigator
const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={HomeDepartment}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="Weather"
        component={Weather}
        options={{ title: "Weather Forecast" }}
      />
    </HomeStack.Navigator>
  );
};

// Map Stack Navigator
const MapStackNavigator = () => {
  return (
    <MapStack.Navigator>
      <MapStack.Screen
        name="Map"
        component={Map}
        options={{ headerShown: false }}
      />
      <MapStack.Screen
        name="HouseDetails"
        component={HouseDetails}
        options={{ headerShown: false }}
      />
    </MapStack.Navigator>
  );
};


// Tab Navigator Configuration
const TabLayout = () => {
  const [weatherData, setWeatherData] = useState(null);
  return (
    <WeatherContext.Provider value={{ weatherData, setWeatherData }}>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: "#161622" },
          tabBarActiveTintColor: "#fff",
          tabBarInactiveTintColor: "#888",
          headerTitleAlign: "center",
          headerShown:false
        }}
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
          component={MapStackNavigator} // Use Map Stack here
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
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-circle-outline" color={color} size={size} />
           ),
          }}
        />
      </Tab.Navigator>
    </WeatherContext.Provider>  
  );
};

export default TabLayout;
