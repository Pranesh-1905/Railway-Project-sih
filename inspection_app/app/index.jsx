// app/index.jsx
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { View, Text, ActivityIndicator } from "react-native";

export default function Index() {
  const { auth, loading } = useAuth(); 
  const router = useRouter();

  useEffect(() => {}, [auth]);
  
  useEffect(() => {}, [loading]);

  useEffect(() => {
    console.log(
      "Index useEffect - loading:",
      loading,
      "auth:",
      auth?.username ? auth.username : "null"
    );

    if (!loading) {
      setTimeout(() => {
        if (auth?.username) {
          router.replace("/(main)/dashboard");
        } else {
          router.replace("/(auth)/login");
        }
      }, 100);
    }
  }, [auth, loading, router]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1e40af" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return null;
}
