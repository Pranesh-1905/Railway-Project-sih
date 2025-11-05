// app/(main)/inspection/_layout.jsx
import { Stack } from "expo-router";

export default function InspectionLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#1e293b" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Inspection Dashboard" }}
      />
      <Stack.Screen
        name="scanQR"
        options={{ title: "Scan Component" }}
      />
      <Stack.Screen
        name="inspectionForm"
        options={{ title: "Inspection Form" }}
      />
      <Stack.Screen
        name="inspectionHistory"
        options={{ title: "Inspection History" }}
      />
    </Stack>
  );
}
