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
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

const NewSurvey = () => {
  const navigation = useNavigation();
  const [surveyTitle, setSurveyTitle] = useState("");
  const [surveyDescription, setSurveyDescription] = useState("");
  const [questions, setQuestions] = useState([
    { id: "1", text: "", type: "multiple", options: [""], required: false },
  ]);

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { id: Date.now().toString(), text: "", type: "multiple", options: [""], required: false },
    ]);
  };

  const toggleRequired = (questionId) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, required: !q.required } : q
      )
    );
  };

  const removeQuestion = (questionId) => {
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
  };

  const removeOption = (questionId, optionIndex) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? { ...q, options: q.options.filter((_, i) => i !== optionIndex) }
          : q
      )
    );
  };

  const addOption = (questionId) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, options: [...q.options, ""] } : q
      )
    );
  };

  const changeQuestionType = (questionId, type) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, type } : q
      )
    );
  };

  const saveSurvey = () => {
    if (!surveyTitle.trim()) {
      alert("Please add a survey title");
      return;
    }
    console.log("Survey saved:", { surveyTitle, surveyDescription, questions });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.headerCard}>
          <TextInput
            style={styles.titleInput}
            placeholder="Survey Title"
            value={surveyTitle}
            onChangeText={setSurveyTitle}
            placeholderTextColor="#666"
          />
          <TextInput
            style={styles.descriptionInput}
            placeholder="Survey Description (optional)"
            value={surveyDescription}
            onChangeText={setSurveyDescription}
            multiline
            placeholderTextColor="#666"
          />
        </View>

        {questions.map((question, index) => (
          <View key={question.id} style={styles.questionCard}>
            <View style={styles.questionHeader}>
              <Text style={styles.questionNumber}>Question {index + 1}</Text>
              <TouchableOpacity
                onPress={() => removeQuestion(question.id)}
                style={styles.removeButton}
              >
                <MaterialCommunityIcons name="delete-outline" size={24} color="#dc3545" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.questionInput}
              placeholder="Enter your question"
              value={question.text}
              onChangeText={(text) =>
                setQuestions((prev) =>
                  prev.map((q) =>
                    q.id === question.id ? { ...q, text } : q
                  )
                )
              }
            />

            <View style={styles.questionTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  question.type === "multiple" && styles.activeTypeButton,
                ]}
                onPress={() => changeQuestionType(question.id, "multiple")}
              >
                <MaterialCommunityIcons name="radiobox-marked" size={20} color={question.type === "multiple" ? "#fff" : "#666"} />
                <Text style={[styles.typeButtonText, question.type === "multiple" && styles.activeTypeButtonText]}>Multiple Choice</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  question.type === "checkbox" && styles.activeTypeButton,
                ]}
                onPress={() => changeQuestionType(question.id, "checkbox")}
              >
                <MaterialCommunityIcons name="checkbox-marked" size={20} color={question.type === "checkbox" ? "#fff" : "#666"} />
                <Text style={[styles.typeButtonText, question.type === "checkbox" && styles.activeTypeButtonText]}>Checkbox</Text>
              </TouchableOpacity>
            </View>

            {question.options.map((option, optionIndex) => (
              <View key={optionIndex} style={styles.optionContainer}>
                <MaterialCommunityIcons
                  name={question.type === "multiple" ? "radiobox-blank" : "checkbox-blank-outline"}
                  size={24}
                  color="#666"
                />
                <TextInput
                  style={styles.optionInput}
                  placeholder={`Option ${optionIndex + 1}`}
                  value={option}
                  onChangeText={(text) =>
                    setQuestions((prev) =>
                      prev.map((q) =>
                        q.id === question.id
                          ? {
                              ...q,
                              options: q.options.map((o, i) =>
                                i === optionIndex ? text : o
                              ),
                            }
                          : q
                      )
                    )
                  }
                />
                {question.options.length > 1 && (
                  <TouchableOpacity
                    onPress={() => removeOption(question.id, optionIndex)}
                  >
                    <MaterialCommunityIcons name="close" size={24} color="#666" />
                  </TouchableOpacity>
                )}
              </View>
            ))}

            <View style={styles.questionFooter}>
              <TouchableOpacity
                style={styles.addOptionButton}
                onPress={() => addOption(question.id)}
              >
                <MaterialCommunityIcons name="plus-circle-outline" size={24} color="#007AFF" />
                <Text style={styles.addOptionText}>Add Option</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.requiredButton}
                onPress={() => toggleRequired(question.id)}
              >
                <MaterialCommunityIcons
                  name={question.required ? "star" : "star-outline"}
                  size={24}
                  color={question.required ? "#007AFF" : "#666"}
                />
                <Text style={[styles.requiredText, question.required && styles.requiredActiveText]}>
                  Required
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addQuestionButton} onPress={addQuestion}>
          <MaterialCommunityIcons name="plus-circle" size={24} color="#fff" />
          <Text style={styles.addQuestionText}>Add Question</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={saveSurvey}>
          <MaterialCommunityIcons name="content-save" size={24} color="#fff" />
          <Text style={styles.saveButtonText}>Save Survey</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  scrollView: {
    padding: 16,
  },
  headerCard: {
    backgroundColor: "#0500",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  descriptionInput: {
    fontSize: 16,
    color: "#fff",
    minHeight: 60,
  },
  questionCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  questionNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  removeButton: {
    padding: 4,
  },
  questionInput: {
    fontSize: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#e0e0e0",
    paddingVertical: 8,
    marginBottom: 16,
  },
  questionTypeContainer: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 12,
  },
  typeButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#666",
    gap: 8,
  },
  activeTypeButton: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  typeButtonText: {
    color: "#666",
  },
  activeTypeButtonText: {
    color: "#fff",
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
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingVertical: 4,
  },
  questionFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  addOptionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addOptionText: {
    color: "#007AFF",
    fontSize: 16,
  },
  requiredButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  requiredText: {
    color: "#666",
    fontSize: 16,
  },
  requiredActiveText: {
    color: "#007AFF",
  },
  addQuestionButton: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  addQuestionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#28a745",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
    gap: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default NewSurvey;