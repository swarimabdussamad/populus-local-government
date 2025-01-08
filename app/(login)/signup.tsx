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


const SignUp = () => {
  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Full Name" />
      <TextInput style={styles.input} placeholder="Date of Birth" />
      <TextInput style={styles.input} placeholder="Gender" />
      <TextInput style={styles.input} placeholder="House No/Name" />
      <TextInput style={styles.input} placeholder="Place" />
      <TextInput style={styles.input} placeholder="Locality" />
      <TextInput style={styles.input} placeholder="District" />
      <TextInput style={styles.input} placeholder="Mobile No" />
      <TextInput style={styles.input} placeholder="Email" />
      <TextInput style={styles.input} placeholder="Aadhaar No" />
      <Link href="/signup1" style={styles.button}>
        <Text style={styles.buttonText}>Next</Text>
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
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SignUp;
