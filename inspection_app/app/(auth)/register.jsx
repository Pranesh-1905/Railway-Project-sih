import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
  
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { registerService } from "../../services/authService";

const { width, height } = Dimensions.get('window');

const ROLES = [
  { label: "Installation Team", value: "INSTALLATION_TEAM", icon: "🔧" },
  { label: "Field Inspector", value: "FIELD_INSPECTOR", icon: "🔍" },
];

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    role: ROLES[0].value,
    employee_id: "",
    department: "",
    railway_zone: "",
    division: "",
  });
  const [loading, setLoading] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations immediately
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating animation
    const floatingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );
    floatingAnimation.start();

    return () => floatingAnimation.stop();
  }, []);

  const onSubmit = async () => {
    if (!form.username || !form.email || !form.password)
      return Alert.alert("Please fill required fields");
    setLoading(true);
    try {
      await registerService(form);
      Alert.alert("Success", "Account created. Please login.");
      router.replace("/(auth)/login");
    } catch (err) {
      Alert.alert("Registration failed", err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#334155']}
        style={styles.container}
      >
        {/* Animated Background Orbs */}
        <View style={styles.backgroundOrbs}>
          <Animated.View style={[styles.orb1, { opacity: fadeAnim }]} />
          <Animated.View style={[styles.orb2, { opacity: fadeAnim }]} />
          <Animated.View style={[styles.orb3, { opacity: fadeAnim }]} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
              },
            ]}
          >
            {/* Header */}
            <Animated.View
              style={[
                styles.header,
                { transform: [{ translateY: floatAnim }] },
              ]}
            >
              <View style={styles.logoContainer}>
                <LinearGradient
                  colors={['#3b82f6', '#6366f1', '#8b5cf6']}
                  style={styles.logoGradient}
                >
                  <Text style={styles.logoEmoji}>🚂</Text>
                </LinearGradient>
              </View>
              <Text style={styles.title}>Railway QR Inspection Portal</Text>
              <Text style={styles.subtitle}>Ministry of Railways, Government of India</Text>
            </Animated.View>

            {/* Main Card */}
            <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
              <View style={styles.cardHeader}>
                <LinearGradient
                  colors={['#10b981', '#059669']}
                  style={styles.cardIcon}
                >
                  <Text style={styles.cardIconText}>📝</Text>
                </LinearGradient>
                <Text style={styles.cardTitle}>Create Portal Account</Text>
                <Text style={styles.cardSubtitle}>Register for official access</Text>
              </View>

              {/* Role Selection */}
              <View style={styles.roleContainer}>
                <Text style={styles.inputLabel}>Select Role</Text>
                <View style={styles.roleRow}>
                  {ROLES.map((r) => (
                    <TouchableOpacity
                      key={r.value}
                      onPress={() => setForm({ ...form, role: r.value })}
                      style={[
                        styles.roleButton,
                        form.role === r.value && styles.roleSelected,
                      ]}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.roleIcon}>{r.icon}</Text>
                      <Text
                        style={[
                          styles.roleText,
                          form.role === r.value && styles.roleTextSelected,
                        ]}
                      >
                        {r.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Input Fields Grid */}
              <View style={styles.inputGrid}>
                <View style={styles.inputRow}>
                  <View style={[styles.inputContainer, styles.inputHalf]}>
                    <Text style={styles.inputLabel}>Username</Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        placeholder="Enter username"
                        placeholderTextColor="#64748b"
                        value={form.username}
                        onChangeText={(t) => setForm({ ...form, username: t })}
                        style={styles.input}
                      />
                    </View>
                  </View>
                  <View style={[styles.inputContainer, styles.inputHalf]}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        placeholder="Enter email"
                        placeholderTextColor="#64748b"
                        keyboardType="email-address"
                        value={form.email}
                        onChangeText={(t) => setForm({ ...form, email: t })}
                        style={styles.input}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.inputRow}>
                  <View style={[styles.inputContainer, styles.inputHalf]}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        placeholder="Enter password"
                        placeholderTextColor="#64748b"
                        secureTextEntry
                        value={form.password}
                        onChangeText={(t) => setForm({ ...form, password: t })}
                        style={styles.input}
                      />
                    </View>
                  </View>
                  <View style={[styles.inputContainer, styles.inputHalf]}>
                    <Text style={styles.inputLabel}>Phone</Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        placeholder="Enter phone"
                        placeholderTextColor="#64748b"
                        keyboardType="phone-pad"
                        value={form.phone}
                        onChangeText={(t) => setForm({ ...form, phone: t })}
                        style={styles.input}
                      />
                    </View>
                  </View>
                </View>
              </View>

              {/* Railway Staff Details */}
              <View style={styles.staffDetails}>
                <Text style={styles.sectionTitle}>Railway Staff Details</Text>
                
                <View style={styles.inputRow}>
                  <View style={[styles.inputContainer, styles.inputHalf]}>
                    <Text style={styles.inputLabel}>Employee ID</Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        placeholder="Employee ID"
                        placeholderTextColor="#64748b"
                        value={form.employee_id}
                        onChangeText={(t) => setForm({ ...form, employee_id: t })}
                        style={styles.input}
                      />
                    </View>
                  </View>
                  <View style={[styles.inputContainer, styles.inputHalf]}>
                    <Text style={styles.inputLabel}>Department</Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        placeholder="Department"
                        placeholderTextColor="#64748b"
                        value={form.department}
                        onChangeText={(t) => setForm({ ...form, department: t })}
                        style={styles.input}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.inputRow}>
                  <View style={[styles.inputContainer, styles.inputHalf]}>
                    <Text style={styles.inputLabel}>Railway Zone</Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        placeholder="Railway Zone"
                        placeholderTextColor="#64748b"
                        value={form.railway_zone}
                        onChangeText={(t) => setForm({ ...form, railway_zone: t })}
                        style={styles.input}
                      />
                    </View>
                  </View>
                  <View style={[styles.inputContainer, styles.inputHalf]}>
                    <Text style={styles.inputLabel}>Division</Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        placeholder="Division"
                        placeholderTextColor="#64748b"
                        value={form.division}
                        onChangeText={(t) => setForm({ ...form, division: t })}
                        style={styles.input}
                      />
                    </View>
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.createButton, loading && styles.createButtonDisabled]}
                  onPress={onSubmit}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={loading ? ['#64748b', '#475569'] : ['#10b981', '#059669']}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.buttonText}>
                      {loading ? "Creating Account..." : "Create Account"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.push("/(auth)/login")}
                  style={styles.loginLink}
                  activeOpacity={0.7}
                >
                  <Text style={styles.loginText}>Already have an account? Sign In</Text>
                </TouchableOpacity>
              </View>

              {/* Footer Note */}
              <Text style={styles.footerNote}>
                <Text style={styles.footerBold}>Note:</Text> This portal is for authorized government personnel only.
              </Text>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  backgroundOrbs: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  orb1: {
    position: 'absolute',
    top: '25%',
    left: '25%',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  orb2: {
    position: 'absolute',
    top: '75%',
    right: '25%',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  orb3: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    marginLeft: -125,
    marginTop: -125,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logoEmoji: {
    fontSize: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(59, 130, 246, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    fontWeight: '600',
  },
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 10,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  cardIconText: {
    fontSize: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  roleContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 8,
  },
  roleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  roleButton: {
    flex: 1,
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 70,
  },
  roleSelected: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: 'rgba(59, 130, 246, 0.6)',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  roleIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  roleText: {
    color: '#94a3b8',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 12,
  },
  roleTextSelected: {
    color: '#ffffff',
    fontWeight: '700',
  },
  inputGrid: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  inputContainer: {
    flex: 1,
  },
  inputHalf: {
    flex: 1,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  staffDetails: {
    backgroundColor: 'rgba(51, 65, 85, 0.3)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10b981',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 8,
  },
  createButton: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  loginLink: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(71, 85, 105, 0.5)',
    borderRadius: 12,
    marginBottom: 20,
  },
  loginText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },
  footerNote: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 16,
  },
  footerBold: {
    fontWeight: '700',
  },
});
