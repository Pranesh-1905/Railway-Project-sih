import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../utils/api";

export default function InstallationIndex() {
  const router = useRouter();
  const { logout } = useAuth();
  const [components, setComponents] = useState([]);
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

    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/components/");
      setComponents(data);
    } catch (err) {
      Alert.alert("Error", "Failed to fetch components");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <Animated.View
      style={[
        styles.componentCard,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={['rgba(30, 41, 59, 0.8)', 'rgba(51, 65, 85, 0.6)']}
        style={styles.cardGradient}
      >
        <View style={styles.cardHeader}>
          <View style={styles.componentInfo}>
            <Text style={styles.componentName}>{item.component_name}</Text>
            <Text style={styles.componentId}>ID: {item.component_id}</Text>
          </View>
          <View style={[
            styles.statusBadge,
            item.status === "Installed" ? styles.statusInstalled : styles.statusPending
          ]}>
            <Text style={[
              styles.statusText,
              item.status === "Installed" ? styles.statusTextInstalled : styles.statusTextPending
            ]}>
              {item.status === "Installed" ? "✅ Installed" : "⏳ Pending"}
            </Text>
          </View>
        </View>

        {item.installation_location && (
          <View style={styles.locationInfo}>
            <Text style={styles.locationLabel}>📍 Location:</Text>
            <Text style={styles.locationValue}>{item.installation_location}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.installButton}
          onPress={() =>
            router.push({
              pathname: "installationForm",
              params: { componentId: item.component_id },
            })
          }
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={item.status === "Installed" ? ['#f59e0b', '#d97706'] : ['#3b82f6', '#6366f1']}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>
              {item.status === "Installed" ? "🔄 Update / Reinstall" : "🔧 Install"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );

  return (
    <>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <LinearGradient
                  colors={['#ef4444', '#dc2626']}
                  style={styles.logoutGradient}
                >
                  <Text style={styles.logoutText}>Logout</Text>
                </LinearGradient>
              </TouchableOpacity>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#334155']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <Animated.View 
            style={[styles.header, { opacity: fadeAnim }]}
          >
            <View style={styles.headerTop}>
              <View style={styles.titleContainer}>
                <LinearGradient
                  colors={['#f59e0b', '#d97706']}
                  style={styles.headerIcon}
                >
                  <Text style={styles.headerEmoji}>🔧</Text>
                </LinearGradient>
                <View>
                  <Text style={styles.headerTitle}>Component Installation</Text>
                  <Text style={styles.headerSubtitle}>Installation Team Portal</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.scanButton}
              onPress={() => router.push("/(main)/installation/scanQR")}
            >
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.scanGradient}
              >
                <Text style={styles.scanText}>➕ Install New Component</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Components List */}
          {loading ? (
            <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
              <LinearGradient
                colors={['rgba(30, 41, 59, 0.6)', 'rgba(51, 65, 85, 0.4)']}
                style={styles.loadingCard}
              >
                <Text style={styles.loadingText}>Loading components...</Text>
              </LinearGradient>
            </Animated.View>
          ) : (
            <FlatList
              data={components}
              keyExtractor={(item) => item.component_id}
              renderItem={renderItem}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <Animated.View 
                  style={[styles.emptyContainer, { opacity: fadeAnim }]}
                >
                  <LinearGradient
                    colors={['rgba(30, 41, 59, 0.6)', 'rgba(51, 65, 85, 0.4)']}
                    style={styles.emptyCard}
                  >
                    <Text style={styles.emptyIcon}>🔧</Text>
                    <Text style={styles.emptyTitle}>No Components Found</Text>
                    <Text style={styles.emptyText}>
                      Scan a QR code to start installing components
                    </Text>
                  </LinearGradient>
                </Animated.View>
              }
            />
          )}
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
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  headerEmoji: {
    fontSize: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 14,
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
    width: 80, // changed from 40 to 80 for rectangular
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
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8, // changed from 20 to 8 for rectangular
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  scanButton: {
    borderRadius: 8, // changed from 16 to 8 for rectangular
    overflow: 'hidden',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    top: 15,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2, // added border
    borderColor: '#10b981', // border color
  },
  scanGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8, // ensure gradient matches button
  },
  scanText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  listContainer: {
    paddingBottom: 20,
  },
  componentCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  cardGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  componentInfo: {
    flex: 1,
  },
  componentName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  componentId: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusInstalled: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: 'rgba(16, 185, 129, 0.5)',
  },
  statusPending: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderColor: 'rgba(245, 158, 11, 0.5)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextInstalled: {
    color: '#10b981',
  },
  statusTextPending: {
    color: '#f59e0b',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(51, 65, 85, 0.3)',
    borderRadius: 12,
    padding: 12,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
    marginRight: 8,
  },
  locationValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
    flex: 1,
  },
  installButton: {
    borderRadius: 8, // changed from 12 to 8 for rectangular
    overflow: 'hidden',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2, // added border
    borderColor: '#3b82f6', // border color
  },
  buttonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8, // ensure gradient matches button
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingCard: {
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyCard: {
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 24,
  },
});