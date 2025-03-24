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
import axios from "axios";

const SELF_GOVERNMENT_TYPES = ["Panchayath", "Municipality"];
const PALAKKAD_LOCAL_BODIES = {
  Panchayath: [
    "SREEKRISHNAPURAM",
    "AGALI",
    "AKATHETHARA",
    "ALANALLUR",
    "ALATHUR",
    "AMBALAPARA",
    "ANAKKARA",
    "ANANGANADI",
    "AYILUR",
    "CHALAVARA",
    "CHALISSERI",
    "COYALAMMANAM",
    "ELAPPULLY",
    "ELEVANCHERY",
    "ERIMAYUR",
    "ERUTHEMPATHY",
    "KADAMPAZHIPURAM",
    "KANHIRAPUZHA",
    "KANNADI",
    "KANNAMBRA",
    "KAPPUR",
    "KARAKURUSSI",
    "KARIMPUZHA",
    "KAVASSERI",
    "KERALASSERY",
    "KIZHAKKANCHERY",
    "KODUMBA",
    "KODUVAYUR",
    "KOLLENGODE",
    "KONGAD",
    "KOPPAM",
    "KOTTOPPADAM",
    "KOTTAYI",
    "KOZHINJAMPARA",
    "KARIMBA",
    "KULUKKALLUR",
    "KUMARAMPUTHUR",
    "KUTHANUR",
    "LAKKIDI PERUR",
    "MALAMPUZHA",
    "MANKARA",
    "MANNUR",
    "MARUTHARODE",
    "MATHUR",
    "MUTHUTHALA",
    "MELARCODE",
    "MUNDUR",
    "MUTHALAMADA",
    "NAGALASSERI",
    "NALLEPPILLY",
    "NELLAYA",
    "NELLIAMPATHY",
    "NEMMARA",
    "ONGALLUR",
    "PALLASSANA",
    "POOKKOTTUKAVU",
    "PARUTHUR",
    "PARALI",
    "PATTITHARA",
    "PATTANCHERY",
    "PERUMATTY",
    "PERUNGOTTUKURUSSI",
    "PERUVEMBA",
    "PIRAYIRI",
    "POLPULLY",
    "PUDUCODE",
    "PUDUNAGARAM",
    "PUDUPPARIYARM",
    "PUDUR",
    "PUDUSSERI",
    "SHOLAYUR",
    "TARUR",
    "THACHAMPARA",
    "THACHANATTUKARA",
    "THENKURUSSI",
    "THENKARA",
    "THIRUMITTACODE",
    "THIRUVEGAPURA",
    "TRIKKADIRI",
    "THRITHALA",
    "VADAKKANCHERY",
    "VADAKARAPATHY",
    "VADAVANNUR",
    "VALLAPUZHA",
    "VANDAZHY",
  ],
  Municipality: [
    "PALAKKAD",
    "CHITTUR-TATTAMANGALAM",
    "MANNARKKAD",
    "CHERPULASSERY",
    "OTTPPALAM",
    "SHORANUR",
    "PATTAMBI",
  ],
};

// Define the shape of the form data
interface FormData {
  selfGovType: string;
  locality: string;
  email: string;
  phone: string;
}

// Define the shape of the errors object
interface Errors {
  selfGovType?: string;
  locality?: string;
  email?: string;
  phone?: string;
}

const addLocal = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    selfGovType: "",
    locality: "",
    email: "",
    phone:"",
  });
  const [errors, setErrors] = useState<Errors>({});

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const getLocalityOptions = () => {
    const { selfGovType } = formData;
    return selfGovType === "Panchayath"
      ? PALAKKAD_LOCAL_BODIES.Panchayath
      : selfGovType === "Municipality"
      ? PALAKKAD_LOCAL_BODIES.Municipality
      : [];
  };

  const handleSignUp = async () => {
    const newErrors: Errors = {};
    if (!formData.selfGovType) newErrors.selfGovType = "Government type is required";
    if (!formData.locality) newErrors.locality = "Local government name is required";
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
      const response = await fetch(`${API_URL}/government/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locality: formData.locality,
          phone: formData.phone,
          email: formData.email,
          selfGovType: formData.selfGovType
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Sign-up failed");
      }

      Alert.alert(
        "Success",
        "Account created successfully! You can now log in.",
        [{ text: "OK", onPress: () => router.push("/dashboard") }]
      );
    } catch (error) {
      // Handle the error safely
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "An unexpected error occurred.");
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create Local Government Account</Text>
          <Text style={styles.subtitle}>Please fill in their details</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Government Details</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.selfGovType}
              onValueChange={(value) => handleInputChange("selfGovType", value)}
              style={styles.picker}
            >
              <Picker.Item label="Select Government Type" value="" />
              {SELF_GOVERNMENT_TYPES.map((type) => (
                <Picker.Item label={type} value={type} key={type} />
              ))}
            </Picker>
          </View>
          {formData.selfGovType && (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.locality}
                onValueChange={(value) => handleInputChange("locality", value)}
                style={styles.picker}
              >
                {getLocalityOptions().map((locality) => (
                  <Picker.Item label={locality} value={locality} key={locality} />
                ))}
              </Picker>
            </View>
          )}
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
          {/* Add Phone Number Input */}
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
        <TouchableOpacity
          style={[styles.navButton, styles.submitButton]}
          onPress={handleSignUp}
        >
          <Text style={styles.navButtonText}>Create Account</Text>
        </TouchableOpacity>
      </ScrollView>
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
    backgroundColor: "#1e3a8a", // Background color
    paddingHorizontal: 20, // Horizontal padding
    paddingVertical: 10, // Vertical padding
    borderRadius: 8, // Rounded corners
    marginTop: 20, // Margin from the top
  },
});

export default addLocal;