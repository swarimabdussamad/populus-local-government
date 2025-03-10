import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/constants/constants";


function NewSurvey() {
  const navigation = useNavigation();
  const [surveyTitle, setSurveyTitle] = useState("");
  const [question, setQuestion] = useState({
    text: "",
    options: ["", ""], // Default 2 options
  });

  const addOption = () => {
    if (question.options.length < 4) {
      setQuestion((prev) => ({
        ...prev,
        options: [...prev.options, ""],
      }));
    }
  };

  const removeOption = (optionIndex) => {
    if (question.options.length > 2) {
      setQuestion((prev) => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== optionIndex),
      }));
    }
  };

  const createSurvey = async () => {
    // Input validation
    if (!surveyTitle.trim()) {
      alert("Please add a survey title");
      return;
    }
    if (!question.text.trim()) {
      alert("Please add a question");
      return;
    }
    if (question.options.some((option) => !option.trim())) {
      alert("Please fill all options");
      return;
    }
  
    // Get the token from AsyncStorage
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      alert("User token not found. Please log in again.");
      return;
    }
  
    // Prepare survey data
    const surveyData = {
      title: surveyTitle,
      question: question.text,
      options: question.options,
    };
  
    try {
      // Send the request to the backend
      const response = await fetch(`${API_URL}/government/create_survey`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
        body: JSON.stringify(surveyData),
      });
  
      // Handle the response
      const result = await response.json();
      if (response.ok) {
        alert("Survey created successfully!");
        navigation.goBack(); // Navigate back after successful creation
      } else {
        // Display error message from the backend
        alert(result.message || "Failed to create survey");
      }
    } catch (error) {
      console.error("Error creating survey:", error);
      alert("An error occurred while creating the survey");
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>

        {/* Survey Title Input */}
        <View style={styles.card}>
          <Text style={styles.label}>Survey Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter survey title"
            value={surveyTitle}
            onChangeText={setSurveyTitle}
            placeholderTextColor="#999" />
        </View>

        {/* Question Section */}
        <View style={styles.card}>
          <Text style={styles.label}>Question</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your question"
            value={question.text}
            onChangeText={(text) => setQuestion((prev) => ({ ...prev, text }))}
            placeholderTextColor="#999" />

          {/* Options Section */}
          <Text style={[styles.label, { marginTop: 16 }]}>Options</Text>
          {question.options.map((option, optionIndex) => (
            <View key={optionIndex} style={styles.optionContainer}>
              <MaterialCommunityIcons
                name="radiobox-blank"
                size={24}
                color="#1b1b7e" />
              <TextInput
                style={styles.optionInput}
                placeholder={`Option ${optionIndex + 1}`}
                value={option}
                onChangeText={(text) => setQuestion((prev) => ({
                  ...prev,
                  options: prev.options.map((o, i) => i === optionIndex ? text : o
                  ),
                }))}
                placeholderTextColor="#999" />
              {question.options.length > 2 && (
                <TouchableOpacity onPress={() => removeOption(optionIndex)}>
                  <MaterialCommunityIcons name="close" size={24} color="#ff4444" />
                </TouchableOpacity>
              )}
            </View>
          ))}

          {/* Add Option Button */}
          {question.options.length < 4 && (
            <TouchableOpacity style={styles.addOptionButton} onPress={addOption}>
              <MaterialCommunityIcons
                name="plus-circle-outline"
                size={24}
                color="#1b1b7e" />
              <Text style={styles.addOptionText}>Add Option</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Create Survey Button */}
        <TouchableOpacity style={styles.createButton} onPress={createSurvey}>
          <Text style={styles.createButtonText}>Create Survey</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1b1b7e",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    color: "#333",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingVertical: 8,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  optionInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingVertical: 4,
  },
  addOptionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  addOptionText: {
    color: "#1b1b7e",
    fontSize: 16,
    fontWeight: "500",
  },
  createButton: {
    backgroundColor: "#1b1b7e",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default NewSurvey;