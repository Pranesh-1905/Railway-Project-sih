import React, { useState } from "react";
import { View, Text, Button, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";

export default function ScanQR() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    Alert.alert("QR Scanned", `Component ID: ${data}`, [
      {
        text: "OK",
        onPress: () => router.push({
          pathname: "/(main)/inspection/inspectionForm",
          params: { componentId: data }
        })
      }
    ]);
  };

  if (!permission) return <Text>Requesting camera permission...</Text>;
  if (!permission.granted)
    return (
      <View>
        <Text>Camera permission required</Text>
        <Button title="Grant" onPress={requestPermission} />
      </View>
    );

  return (
    <CameraView
      style={{ flex: 1 }}
      onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
    />
  );
}
