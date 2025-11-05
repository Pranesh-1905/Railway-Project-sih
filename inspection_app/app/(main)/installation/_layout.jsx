// app/(main)/installation/_layout.jsx
import React from "react";
import { Stack } from "expo-router";

export default function InstallationLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Installation Management",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="scanQR"
        options={{
          title: "Scan QR Code",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="installationForm"
        options={{
          title: "Install Component",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
