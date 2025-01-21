import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import ImagePickerComponent from "../../components/ImagePickerComponent";
import Gender from "../../components/gender";
import { API_URL } from "../../constants/constants";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "",
    house: "",
    place: "",
    locality: "",
    district: "",
    mobile: "",
    email: "",
    aadhaar: "",
    username: "",
    password: "",
    photo: "",
  });
  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSignUp = async () => {
    try {
      const response = await fetch(`${API_URL}/government/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Sign-up failed");
      }

      const data = await response.json();
      Alert.alert("Success", "Account created successfully! You can now log in.");
    } catch (error) {
      Alert.alert("Error", error.message);
      console.error("Sign-up error:", error);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      handleInputChange("dob", formattedDate);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={formData.fullName}
          onChangeText={(text) => handleInputChange("fullName", text)}
        />
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={{ color: formData.dob ? "#000" : "#aaa" }}>
            {formData.dob || "Select Date of Birth"}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={formData.dob ? new Date(formData.dob) : new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
        <View style={styles.input}>
        <Gender
          value={formData.gender}
          setValue={(value) => handleInputChange("gender", value)}
          error={errors.gender}
        />

        </View>
        
        <TextInput
          style={styles.input}
          placeholder="House No/Name"
          value={formData.house}
          onChangeText={(text) => handleInputChange("house", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Place"
          value={formData.place}
          onChangeText={(text) => handleInputChange("place", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Locality"
          value={formData.locality}
          onChangeText={(text) => handleInputChange("locality", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="District"
          value={formData.district}
          onChangeText={(text) => handleInputChange("district", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Mobile No"
          keyboardType="phone-pad"
          value={formData.mobile}
          onChangeText={(text) => handleInputChange("mobile", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={formData.email}
          onChangeText={(text) => handleInputChange("email", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Aadhaar No"
          keyboardType="phone-pad"
          value={formData.aadhaar}
          onChangeText={(text) => handleInputChange("aadhaar", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="User Name"
          value={formData.username}
          onChangeText={(text) => handleInputChange("username", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          value={formData.password}
          onChangeText={(text) => handleInputChange("password", text)}
        />
        <ImagePickerComponent
          value={formData.photo} // Pass the current value of the photo field
          onChange={(fileUri) => handleInputChange("photo", fileUri)} // Update the formData with the selected photo
        />

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#1e3a8a",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
  },
  button: {
    height: 50,
    backgroundColor: "#1e3a8a",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SignUp;
