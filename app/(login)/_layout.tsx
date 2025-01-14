import React from "react";
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{headerShown:false,}} />
      <Stack.Screen name="login" options={{ headershown:false,title:'Login' }} />
      <Stack.Screen name="signup" options={{ headershown:false,title:'SignUp'}} />
      
    </Stack>
  );
}
