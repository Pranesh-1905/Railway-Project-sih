import React, { useState, useEffect, useRef } from "react";
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
import api from "../../../utils/api";
import { useAuth } from "../../../context/AuthContext";

export default function InspectionIndex() {
  const router = useRouter();
  const [components, setComponents] = useState([]);
  const { logout } = useAuth();

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

    // Uncomment when API is ready
    // async function fetchInstalledComponents() {
    //   try {
    //     const { data } = await api.get("/components/installed");
    //     setComponents(data);
    //   } catch (err) {
    //     console.log(err.message);
    //   }
    // }
    // fetchInstalledComponents();
  }, []);

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

  const renderItem = ({ item, index }) => (
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
            item.status === "Needs Replacement" && styles.statusDanger
          ]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.inspectButton]}
            onPress={() => router.push({
              pathname: "/(main)/inspection/inspectionForm",
              params: { componentId: item.component_id }
            })}
          >
            <LinearGradient
              colors={['#3b82f6', '#6366f1']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>🔍 Inspect</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.historyButton]}
            onPress={() => router.push({
              pathname: "/(main)/inspection/inspectionHistory",
              params: { componentId: item.component_id }
            })}
          >
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>📋 History</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {item.status === "Needs Replacement" && (
          <TouchableOpacity
            style={styles.replaceButton}
            onPress={async () => {
              try {
                await api.post(`/inspection/replace/${item.component_id}`);
                Alert.alert("Success", "Component replaced successfully");
              } catch (err) {
                Alert.alert("Error", err.message);
              }
            }}
          >
            <LinearGradient
              colors={['#ef4444', '#dc2626']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>🔄 Replace</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </LinearGradient>
    </Animated.View>
  );

  return (
    <>
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
                  colors={['#3b82f6', '#6366f1']}
                  style={styles.headerIcon}
                >
                  <Text style={styles.headerEmoji}>🔍</Text>
                </LinearGradient>
                <View>
                  <Text style={styles.headerTitle}>Quality Inspection</Text>
                  <Text style={styles.headerSubtitle}>Field Inspector Portal</Text>
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

            <TouchableOpacity 
              style={styles.scanButton}
              onPress={() => router.push("/(main)/inspection/scanQR")}
            >
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.scanGradient}
              >
                <Text style={styles.scanText}>🔍 Scan New Component</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Components List */}
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
                  <Text style={styles.emptyIcon}>🔍</Text>
                  <Text style={styles.emptyTitle}>No Components Found</Text>
                  <Text style={styles.emptyText}>
                    Scan a QR code to start inspecting components
                  </Text>
                </LinearGradient>
              </Animated.View>
            }
          />
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
    shadowColor: '#3b82f6',
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
    borderRadius: 12,
    overflow: 'hidden',
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
  scanButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  scanGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: 'rgba(239, 68, 68, 0.5)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10b981',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  replaceButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
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