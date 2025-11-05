import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Animated,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../utils/api";

export default function InstallationForm() {
  const { componentId } = useLocalSearchParams();
  const router = useRouter();
  const { logout } = useAuth();
  const [component, setComponent] = useState(null);
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

    if (componentId) fetchComponent();
  }, [componentId]);

  const fetchComponent = async () => {
    try {
      const { data } = await api.get(`/components/${componentId}`);
      setComponent(data);
    } catch (err) {
      Alert.alert("Error", "Component not found");
    }
  };

  const installComponent = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location access is required");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      await api.post(`/components/${componentId}/install`, {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      Alert.alert("Success", "Component installed successfully!");
      router.replace("/(main)/installation");
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/(auth)/login");
          },
        },
      ]
    );
  };

  // Helper to extract lat/lon from installation_location string
  function getLatLngFromLocationString(locationStr) {
    if (!locationStr) return [null, null];
    const parts = locationStr.split(',');
    if (parts.length === 2) {
      const lat = parseFloat(parts[0]);
      const lng = parseFloat(parts[1]);
      if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
    }
    return [null, null];
  }

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
                <View style={styles.headerTop}>
                  <View style={styles.titleContainer}>
                    <LinearGradient
                      colors={['#f59e0b', '#d97706']}
                      style={styles.headerIcon}
                    >
                      <Text style={styles.headerEmoji}>🔧</Text>
                    </LinearGradient>
                    <View>
                      <Text style={styles.headerTitle}>Install Component</Text>
                      <Text style={styles.headerSubtitle}>Installation Details</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <LinearGradient
                      colors={['#ef4444', '#dc2626']}
                      style={styles.logoutGradient}
                    >
                      <Text style={styles.logoutText}>Logout</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Component Information Card */}
              <LinearGradient
                colors={['rgba(30, 41, 59, 0.8)', 'rgba(51, 65, 85, 0.6)']}
                style={styles.infoCard}
              >
                <Text style={styles.cardTitle}>Component Information</Text>
                <View style={styles.detailsGrid}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>ID:</Text>
                    <Text style={styles.detailValue}>{component.component_id}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Name:</Text>
                    <Text style={styles.detailValue}>{component.component_name}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Item Code:</Text>
                    <Text style={styles.detailValue}>{component.item_code}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Serial Number:</Text>
                    <Text style={styles.detailValue}>{component.serial_number}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Batch Number:</Text>
                    <Text style={styles.detailValue}>{component.batch_number}</Text>
                  </View>
                </View>
              </LinearGradient>

              {/* Manufacturing Details Card */}
              <LinearGradient
                colors={['rgba(30, 41, 59, 0.8)', 'rgba(51, 65, 85, 0.6)']}
                style={styles.infoCard}
              >
                <Text style={styles.cardTitle}>Manufacturing Details</Text>
                <View style={styles.detailsGrid}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Manufacturer:</Text>
                    <Text style={styles.detailValue}>{component.manufacturer}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Production Date:</Text>
                    <Text style={styles.detailValue}>
                      {new Date(component.production_date).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Warranty Period:</Text>
                    <Text style={styles.detailValue}>{component.warranty_period} months</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Unit Weight:</Text>
                    <Text style={styles.detailValue}>{component.unit_weight} kg</Text>
                  </View>
                </View>
              </LinearGradient>

              {/* Technical Specifications Card */}
              <LinearGradient
                colors={['rgba(30, 41, 59, 0.8)', 'rgba(51, 65, 85, 0.6)']}
                style={styles.infoCard}
              >
                <Text style={styles.cardTitle}>Technical Specifications</Text>
                <View style={styles.detailsGrid}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>IRS Specification:</Text>
                    <Text style={styles.detailValue}>{component.irs_specification}</Text>
                  </View>
                  {component.specifications &&
                    Object.entries(component.specifications).map(([key, value]) => (
                      <View key={key} style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{key}:</Text>
                        <Text style={styles.detailValue}>{String(value)}</Text>
                      </View>
                    ))}
                </View>
              </LinearGradient>

              {/* Quality & Status Card */}
              <LinearGradient
                colors={['rgba(30, 41, 59, 0.8)', 'rgba(51, 65, 85, 0.6)']}
                style={styles.infoCard}
              >
                <Text style={styles.cardTitle}>Quality & Status</Text>
                <View style={styles.detailsGrid}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>QC Status:</Text>
                    <Text style={styles.detailValue}>{component.qc_status}</Text>
                  </View>
                  {component.qc_date && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>QC Date:</Text>
                      <Text style={styles.detailValue}>
                        {new Date(component.qc_date).toLocaleDateString()}
                      </Text>
                    </View>
                  )}
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Current Status:</Text>
                    <Text style={styles.detailValue}>{component.status || "Pending Installation"}</Text>
                  </View>
                  {component.warehouse_id && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Warehouse:</Text>
                      <Text style={styles.detailValue}>{component.warehouse_id}</Text>
                    </View>
                  )}
                </View>
              </LinearGradient>

              {/* Current Installation Card (if applicable) */}
              {component.installation_location && (
                <LinearGradient
                  colors={['rgba(30, 41, 59, 0.8)', 'rgba(51, 65, 85, 0.6)']}
                  style={styles.infoCard}
                >
                  <Text style={styles.cardTitle}>Current Installation</Text>
                  <View style={styles.detailsGrid}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Location:</Text>
                      <Text style={styles.detailValue}>{component.installation_location}</Text>
                    </View>
                    {component.last_maintenance && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Last Maintenance:</Text>
                        <Text style={styles.detailValue}>
                          {new Date(component.last_maintenance).toLocaleDateString()}
                        </Text>
                      </View>
                    )}
                  </View>
                  {/* Google Maps Button */}
                  {(() => {
                    const [lat, lng] = getLatLngFromLocationString(component.installation_location);
                    if (lat && lng) {
                      return (
                        <TouchableOpacity
                          style={styles.mapButton}
                          onPress={() => {
                            const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
                            Linking.openURL(url);
                          }}
                          activeOpacity={0.8}
                        >
                          <LinearGradient
                            colors={['#3b82f6', '#10b981']}
                            style={styles.mapButtonGradient}
                          >
                            <Text style={styles.mapButtonText}>Open in Google Maps</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      );
                    } else {
                      return (
                        <Text style={{color:'#94a3b8', marginTop:8, textAlign:'center', fontSize:12}}>
                          No coordinates available for map
                        </Text>
                      );
                    }
                  })()}
                </LinearGradient>
              )}

              {/* Install Button */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.installButton, (loading || component.status === "Installed") && styles.installButtonDisabled]}
                  onPress={installComponent}
                  disabled={loading || component.status === "Installed"}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={loading || component.status === "Installed" ? ['#64748b', '#475569'] : ['#3b82f6', '#6366f1']}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.buttonText}>
                      {loading ? "Installing..." : 
                       component.status === "Installed" ? "Already Installed" : 
                       "Install Component"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
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
    marginBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  headerEmoji: {
    fontSize: 24,
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
  logoutButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    borderRadius: 8, // changed from 10 to 8 for rectangular
    overflow: 'hidden',
    width: 82, // changed from 40 to 80 for rectangular
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderWidth: 2, // added border
    borderColor: '#ef4444', // border color
  },
  logoutGradient: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
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
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  detailsGrid: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 40,
  },
  installButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  installButtonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  mapButton: {
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  mapButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});