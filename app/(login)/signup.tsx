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
import DateTimePicker from "@react-native-community/datetimepicker";
import ImagePickerComponent from "../../components/ImagePickerComponent";
import { API_URL } from "../../constants/constants";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const KERALA_DISTRICTS = [
  "Palakkad",
  "Thiruvananthapuram",
  "Kollam",
  "Pathanamthitta",
  "Alappuzha",
  "Kottayam",
  "Idukki",
  "Ernakulam",
  "Thrissur",
  "Malappuram",
  "Kozhikode",
  "Wayanad",
  "Kannur",
  "Kasaragod",
];

const SELF_GOVERNMENT_TYPES = ["Panchayath", "Municipality"];
const PALAKKAD_LOCAL_BODIES = {
  Panchayath: [
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
    "SREEKRISHNAPURAM",
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

const SignUp = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "",
    house: "",
    place: "",
    district: "Palakkad",
    selfGovType: "",
    locality: "",
    mobile: "",
    email: "",
    aadhaar: "",
    username: "",
    password: "",
    photo: "",
  });
  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentSection, setCurrentSection] = useState(1);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "locality" ? { username: value } : {}), // Sync locality with username
    }));
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      handleInputChange("dob", formattedDate);
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
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.mobile) newErrors.mobile = "Mobile number is required";
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Sign-up failed");
      }

      Alert.alert(
        "Success",
        "Account created successfully! You can now log in.",
        [{ text: "OK", onPress: () => router.push("/success") }]
      );
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case 1:
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            {renderInputField("Full Name", "fullName")}
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <MaterialIcons name="date-range" size={24} color="#1e3a8a" />
              <Text style={styles.datePickerText}>
                {formData.dob || "Select Date of Birth"}
              </Text>
            </TouchableOpacity>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.gender}
                onValueChange={(value) => handleInputChange("gender", value)}
                style={styles.picker}
              >
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address Details</Text>
            {renderInputField("House No/Name", "house")}
            {renderInputField("Place", "place")}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.district}
                onValueChange={(value) => handleInputChange("district", value)}
                style={styles.picker}
              >
                {KERALA_DISTRICTS.map((district) => (
                  <Picker.Item label={district} value={district} key={district} />
                ))}
              </Picker>
            </View>
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
          </View>
        );
      case 3:
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact & Identity</Text>
            {renderInputField("Mobile No", "mobile", "phone-pad")}
            {renderInputField("Email", "email", "email-address")}
            {renderInputField("Aadhaar No", "aadhaar", "number-pad")}
            {renderInputField("Username", "username")}
            {renderInputField("Password", "password", "default", true)}
            <View style={styles.photoContainer}>
              <Text style={styles.photoLabel}>Profile Photo</Text>
              <ImagePickerComponent
                value={formData.photo}
                onChange={(fileUri) => handleInputChange("photo", fileUri)}
              />
            </View>
          </View>
        );
    }
  };

  const renderInputField = (placeholder, field, keyboardType = "default", isSecure = false) => (
    <View style={styles.inputContainer}>
      <TextInput
        style={[styles.input, errors[field] && styles.inputError]}
        placeholder={placeholder}
        value={formData[field]}
        onChangeText={(text) => handleInputChange(field, text)}
        keyboardType={keyboardType}
        secureTextEntry={isSecure}
        placeholderTextColor="#666"
      />
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Please fill in your details</Text>
        </View>
        <View style={styles.progressContainer}>
          {[1, 2, 3].map((step) => (
            <TouchableOpacity
              key={step}
              style={[
                styles.progressStep,
                currentSection === step && styles.activeStep,
                currentSection > step && styles.completedStep,
              ]}
              onPress={() => setCurrentSection(step)}
            >
              <Text
                style={[
                  styles.progressText,
                  (currentSection === step || currentSection > step) &&
                    styles.activeProgressText,
                ]}
              >
                {step}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {renderSection()}
        <View style={styles.navigationButtons}>
          {currentSection > 1 && (
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => setCurrentSection(currentSection - 1)}
            >
              <Text style={styles.navButtonText}>Previous</Text>
            </TouchableOpacity>
          )}
          {currentSection < 3 ? (
            <TouchableOpacity
              style={[styles.navButton, styles.nextButton]}
              onPress={() => setCurrentSection(currentSection + 1)}
            >
              <Text style={styles.navButtonText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.navButton, styles.submitButton]}
              onPress={handleSignUp}
            >
              <Text style={styles.navButtonText}>Create Account</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      {showDatePicker && (
        <DateTimePicker
          value={formData.dob ? new Date(formData.dob) : new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  scrollContainer: { flexGrow: 1, padding: 20 },
  header: { alignItems: "center", marginBottom: 30 },
  title: { fontSize: 28, fontWeight: "bold", color: "#1e3a8a", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#64748b" },
  progressContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 30 },
  progressStep: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e2e8f0",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  activeStep: { backgroundColor: "#1e3a8a" },
  completedStep: { backgroundColor: "#93c5fd" },
  progressText: { color: "#64748b", fontSize: 16, fontWeight: "bold" },
  activeProgressText: { color: "#ffffff" },
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
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#ffffff",
  },
  datePickerText: { marginLeft: 10, fontSize: 16, color: "#1e293b" },
  pickerContainer: {
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "#ffffff",
    overflow: "hidden",
  },
  picker: { height: 50 },
  photoContainer: { marginTop: 10 },
  photoLabel: { fontSize: 16, color: "#1e293b", marginBottom: 8 },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  navButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e2e8f0",
    marginHorizontal: 5,
  },
  nextButton: { backgroundColor: "#3b82f6" },
  submitButton: { backgroundColor: "#1e3a8a" },
  navButtonText: { color: "#ffffff", fontSize: 16, fontWeight: "600" },
});

export default SignUp;
