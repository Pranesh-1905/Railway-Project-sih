import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "../../../utils/api";

export default function InspectionForm() {
  const { componentId } = useLocalSearchParams();
  const router = useRouter();

  const [component, setComponent] = useState(null);
  const [status, setStatus] = useState("OK");
  const [defectType, setDefectType] = useState("");
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    async function fetchComponent() {
      try {
        const { data } = await api.get(`/inspection/component/${componentId}`);
        setComponent(data);
      } catch (err) {
        Alert.alert(
          "Error",
          err.response?.data?.detail || "Component not found"
        );
      }
    }
    fetchComponent();
  }, [componentId]);

  const submitInspection = async () => {
    setLoading(true);
    try {
      const payload = {
        component_id: componentId,
        status,
        comments,
      };
      if (status === "DEFECTED" && defectType.trim()) {
        payload.defect_type = defectType.trim();
      }

      await api.post("/inspection/report", payload);
      Alert.alert("Success", "Inspection submitted");
      router.replace("/(main)/inspection");
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.detail || "Failed to submit inspection"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!component) {
    return (
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#334155']}
        style={styles.loadingContainer}
      >
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <Text style={styles.loadingText}>Loading component details...</Text>
      </LinearGradient>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#334155']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View
              style={[
                styles.content,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              {/* Header */}
              <View style={styles.header}>
                <LinearGradient
                  colors={['#3b82f6', '#6366f1']}
                  style={styles.headerIcon}
                >
                  <Text style={styles.headerEmoji}>🔍</Text>
                </LinearGradient>
                <View style={styles.headerText}>
                  <Text style={styles.headerTitle}>Component Inspection</Text>
                  <Text style={styles.headerSubtitle}>Quality Assessment Form</Text>
                </View>
              </View>

              {/* Component Info Card */}
              <LinearGradient
                colors={['rgba(30, 41, 59, 0.8)', 'rgba(51, 65, 85, 0.6)']}
                style={styles.infoCard}
              >
                <Text style={styles.cardTitle}>Component Information</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>ID:</Text>
                  <Text style={styles.infoValue}>{component._id || component.component_id}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Name:</Text>
                  <Text style={styles.infoValue}>{component.component_name}</Text>
                </View>
              </LinearGradient>

              {/* Inspection Form Card */}
              <LinearGradient
                colors={['rgba(30, 41, 59, 0.8)', 'rgba(51, 65, 85, 0.6)']}
                style={styles.formCard}
              >
                <Text style={styles.cardTitle}>Inspection Details</Text>

                {/* Status Selection */}
                <View style={styles.inputSection}>
                  <Text style={styles.inputLabel}>Component Status</Text>
                  <View style={styles.statusContainer}>
                    <TouchableOpacity
                      style={[
                        styles.statusButton,
                        status === "OK" && styles.statusSelected,
                      ]}
                      onPress={() => setStatus("OK")}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={status === "OK" ? ['#10b981', '#059669'] : ['rgba(51, 65, 85, 0.5)', 'rgba(51, 65, 85, 0.5)']}
                        style={styles.statusGradient}
                      >
                        <Text style={[styles.statusText, status === "OK" && styles.statusTextSelected]}>
                          ✅ OK
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.statusButton,
                        status === "DEFECTED" && styles.statusSelected,
                      ]}
                      onPress={() => setStatus("DEFECTED")}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={status === "DEFECTED" ? ['#ef4444', '#dc2626'] : ['rgba(51, 65, 85, 0.5)', 'rgba(51, 65, 85, 0.5)']}
                        style={styles.statusGradient}
                      >
                        <Text style={[styles.statusText, status === "DEFECTED" && styles.statusTextSelected]}>
                          ❌ DEFECTED
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Defect Type (conditional) */}
                {status === "DEFECTED" && (
                  <View style={styles.inputSection}>
                    <Text style={styles.inputLabel}>Defect Type</Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        placeholder="Describe the type of defect"
                        placeholderTextColor="#64748b"
                        value={defectType}
                        onChangeText={setDefectType}
                        style={styles.textInput}
                      />
                    </View>
                  </View>
                )}

                {/* Comments */}
                <View style={styles.inputSection}>
                  <Text style={styles.inputLabel}>Comments & Remarks</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      placeholder="Add any additional comments or observations"
                      placeholderTextColor="#64748b"
                      value={comments}
                      onChangeText={setComments}
                      style={[styles.textInput, styles.textAreaInput]}
                      multiline
                      numberOfLines={4}
                    />
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                    onPress={submitInspection}
                    disabled={loading}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={loading ? ['#64748b', '#475569'] : ['#3b82f6', '#6366f1']}
                      style={styles.buttonGradient}
                    >
                      <Text style={styles.buttonText}>
                        {loading ? "Submitting..." : "Submit Inspection"}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.historyButton}
                    onPress={() =>
                      router.push({
                        pathname: "/(main)/inspection/inspectionHistory",
                        params: { componentId: componentId }
                      })
                    }
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#10b981', '#059669']}
                      style={styles.buttonGradient}
                    >
                      <Text style={styles.buttonText}>📋 View Past Reports</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </Animated.View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  headerEmoji: {
    fontSize: 24,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    fontWeight: '600',
  },
  infoCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  formCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#94a3b8',
    width: 80,
  },
  infoValue: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
    flex: 1,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statusButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  statusGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#94a3b8',
  },
  statusTextSelected: {
    color: '#ffffff',
    fontWeight: '700',
  },
  inputWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  textInput: {
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
    textAlignVertical: 'top',
  },
  textAreaInput: {
    minHeight: 100,
  },
  buttonContainer: {
    marginTop: 8,
    gap: 12,
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  historyButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
