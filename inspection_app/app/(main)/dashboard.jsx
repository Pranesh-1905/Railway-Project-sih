// app/(main)/dashboard.jsx
import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";

export default function Dashboard() {
  const { auth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth?.role) {
      // Redirect based on role
      if (auth.role === "INSTALLATION_TEAM") {
        router.replace("/(main)/installation");
      } else if (auth.role === "FIELD_INSPECTOR") {
        router.replace("/(main)/inspection");
      } else {
        router.replace("/(main)/default"); // fallback page
      }
    }
  }, [auth]);

  // While auth/role is loading
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#1e40af" />
      <Text style={{ marginTop: 20 }}>Loading dashboard...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
