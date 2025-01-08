import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import ImagePickerComponent from "../../components/ImagePickerComponent";
import { Link } from 'expo-router';



const SignUp1 = () => {
  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="User Name" />
      <TextInput style={styles.input} placeholder="Password" />
      <ImagePickerComponent/>
      <Link href="/signup1" style={styles.button}>
        <Text style={styles.buttonText}>SignUp</Text>
      </Link>
      
    </View>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
  },
  button: {
    height: 50,
    backgroundColor: "#1e3a8a",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderRadius: 8,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SignUp1;
