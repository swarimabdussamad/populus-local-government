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
  KeyboardAvoidingView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { API_URL } from "../../constants/constants";
import { useRouter } from "expo-router";
import MultiSelect from "react-native-multiple-select"; // Install this library

// List of predefined departments with full names
const DEPARTMENTS = [
    "Health Department",
    "Police Department",
    "Education Department",
    "Transport Department",
    "Finance Department",
    "Agriculture Department",
    "Water Resources Department",
    "Electricity Department",
    "Waste Management Department",
    "Urban Development Department",
  ];

const SELF_GOVERNMENT_TYPES = ["Panchayath", "Municipality"];
const PALAKKAD_LOCAL_BODIES = {
  Panchayath: [
    "SREEKRISHNAPURAM",

    "KARIMPUZHA",

    "MALAMPUZHA",

    "MUNDUR",
  ],
  Municipality: [
    "PALAKKAD",
    "MANNARKKAD",
    "CHERPULASSERY",
    "PATTAMBI",
  ],
};

// Define the shape of the form data
interface FormData {
  departmentName: string;
  accessAreas: string[];
  email: string;
  phone: string;
}

// Define the shape of the errors object
interface Errors {
  departmentName?: string;
  accessAreas?: string;
  email?: string;
  phone?: string;
}

const addDept = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    departmentName: "",
    accessAreas: [],
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Errors>({});

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSignUp = async () => {
    const newErrors: Errors = {};
    if (!formData.departmentName) newErrors.departmentName = "Department name is required";
    if (formData.accessAreas.length === 0) newErrors.accessAreas = "At least one access area is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (formData.phone && formData.phone.length !== 10) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Alert.alert("Validation Error", "Please fill in all required fields correctly");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/department/signup`, {
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

      Alert.alert(
        "Success",
        "Department account created successfully!",
        [{ text: "OK", onPress: () => router.push("/dashboard") }]
      );
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "An unexpected error occurred.");
      }
    }
  };

  // Prepare data for MultiSelect
  const accessAreasOptions = [...PALAKKAD_LOCAL_BODIES.Panchayath, ...PALAKKAD_LOCAL_BODIES.Municipality].map((locality) => ({
    id: locality,
    name: locality,
  }));

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Department Account</Text>
          <Text style={styles.subtitle}>Please fill in the department details</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Department Details</Text>
  
          {/* Department Name Dropdown */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.departmentName}
              onValueChange={(value) => handleInputChange("departmentName", value)}
              style={styles.picker}
            >
              <Picker.Item label="Select Department" value="" />
              {DEPARTMENTS.map((department) => (
                <Picker.Item label={department} value={department} key={department} />
              ))}
            </Picker>
            {errors.departmentName && <Text style={styles.errorText}>{errors.departmentName}</Text>}
          </View>
  
          {/* Access Areas (Multi-select) */}
          <View style={styles.inputContainer}>
            <MultiSelect
              items={accessAreasOptions}
              uniqueKey="id"
              onSelectedItemsChange={(selectedItems) =>
                handleInputChange("accessAreas", selectedItems)
              }
              selectedItems={formData.accessAreas}
              selectText="Select Access Areas"
              searchInputPlaceholderText="Search areas..."
              altFontFamily="ProximaNova-Light"
              tagRemoveIconColor="#CCC"
              tagBorderColor="#CCC"
              tagTextColor="#CCC"
              selectedItemTextColor="#CCC"
              selectedItemIconColor="#CCC"
              itemTextColor="#000"
              displayKey="name"
              submitButtonColor="#1e3a8a"
              submitButtonText="Select"
            />
            {errors.accessAreas && <Text style={styles.errorText}>{errors.accessAreas}</Text>}
          </View>
  
          {/* Email */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Email"
              value={formData.email}
              onChangeText={(text) => handleInputChange("email", text)}
              keyboardType="email-address"
              placeholderTextColor="#666"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>
  
          {/* Phone Number */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              placeholder="Phone Number"
              value={formData.phone}
              onChangeText={(text) => handleInputChange("phone", text)}
              keyboardType="phone-pad"
              maxLength={10}
              placeholderTextColor="#666"
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
          </View>
        </View>
  
        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.navButton, styles.submitButton]}
          onPress={handleSignUp}
        >
          <Text style={styles.navButtonText}>Create Department Account</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  scrollContainer: { flexGrow: 1, padding: 20 },
  header: { alignItems: "center", marginBottom: 30 },
  title: { fontSize: 25, fontWeight: "bold", color: "#1e3a8a", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#64748b" },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: { fontSize: 20, fontWeight: "600", color: "#1e3a8a", marginBottom: 20 },
  inputContainer: { marginBottom: 16 },
  input: {
    height: 50,
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1e293b",
    backgroundColor: "#ffffff",
  },
  inputError: { borderColor: "#ef4444" },
  errorText: { color: "#ef4444", fontSize: 12, marginTop: 4, marginLeft: 4 },
  pickerContainer: {
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "#ffffff",
    overflow: "hidden",
  },
  picker: { height: 50 },
  navButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e3a8a",
  },
  navButtonText: { color: "#ffffff", fontSize: 16, fontWeight: "600" },
  submitButton: {
    backgroundColor: "#1e3a8a",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
  },
});

export default addDept;