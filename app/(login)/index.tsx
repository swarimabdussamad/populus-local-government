import {StyleSheet } from 'react-native'
import React from 'react'
import {Redirect} from 'expo-router';  

export default function App() {
  return <Redirect href="/home" />;
}

const styles=StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: '#fff',
    alignItems:'center',
    justifyContent: 'center',
  },
});
