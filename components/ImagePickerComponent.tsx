import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

const ImagePickerComponent: React.FC = () => {
  const [file, setFile] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera roll permission to upload images."
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: true, // Include base64 in the result
      });
      if (!result.canceled) {
        setFile(result.assets[0].uri);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Upload Photo</Text>
      </TouchableOpacity>
      {file ? (
        <Image source={{ uri: file }} style={styles.image} />
      ) : (
        <Text style={styles.placeholderText}>No image selected</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginTop: 10,
  },
  placeholderText: {
    marginTop: 10,
    color: "#999",
    fontSize: 14,
  },
});

export default ImagePickerComponent;
