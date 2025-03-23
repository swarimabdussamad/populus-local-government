import React from "react";
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{headerShown:false,}} />
      <Stack.Screen name="login" options={{ headerShown:false}} />
      <Stack.Screen name="signup" options={{ headerShown:true,title:'Create Account'}} />
      
    </Stack>
  );
}
