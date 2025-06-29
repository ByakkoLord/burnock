import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
} from "react-native";
import {
  CameraView,
  useCameraPermissions,
  BarcodeScanningResult,
} from "expo-camera";
import * as SplashScreen from "expo-splash-screen";
import axios, { AxiosResponse } from "axios";
import { ScrollView } from "react-native";
import Itens from "./components/Itens";
import Forms from "./components/forms";

SplashScreen.preventAutoHideAsync();

type Rep = {
  numero_serie: string;
  modelo: string;
  cliente: string;
  status: string;
};

export default function Index() {
  const [repArray, setRepArray] = useState<Rep[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [formsVisible, setFormsVisible] = useState(false);
  const [backButtonVisible, setBackButtonVisible] = useState(true);
  const [qrResult, setQrResult] = useState<string>("");
    const position = useRef(new Animated.ValueXY({ x: 0, y: 500 })).current;

  useEffect(() => {
    if (formsVisible) {
      setBackButtonVisible(true);
    } else {
      setBackButtonVisible(false);
    }

    Animated.timing(position, {
      toValue: { x: 0, y: 0 },
      duration: 1000,
      useNativeDriver: true,
    }).start();

    axios
      .get("https://burnock-server.onrender.com/reps")
      .then((response: AxiosResponse) => {
        setRepArray(response.data);
      })
      .catch((error: Error) => {
        console.error("Erro ao buscar dados:", error);
      });

    const prepareApp = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await SplashScreen.hideAsync();
    };

    prepareApp();
  }, []);

  const handleBarCodeScanned = (result: BarcodeScanningResult) => {
    if (!scanned) {
      setScanned(true);
      console.log("QR Code escaneado:", result.data);
      setModalVisible(false);
      setFormsVisible(true);
      setQrResult(result.data);
      // Aqui você pode usar o `result.data` para buscar mais informações ou fazer algo com o QR Code.
    }
  };

  const reps = repArray.map((rep, index) => ({
    id: index + 1,
    numero_serie: rep.numero_serie,
    modelo: rep.modelo,
    cliente: rep.cliente,
    status: rep.status,
  }));

  return (
    <View style={styles.container}>
      {formsVisible && (
        <TouchableOpacity
          onPress={() => {
            setFormsVisible(false);
          }}
          style={{
            position: "absolute",
            bottom: 35,
            left: 50,
            zIndex: 999,
            width: 50,
            height: 50,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "black",
            borderRadius: "50%",
          }}
        ></TouchableOpacity>
      )}

      <Forms formVisible={formsVisible} result={qrResult} />
      <ScrollView
        style={{ flex: 1, width: "100%", marginTop: 50 }}
        contentContainerStyle={{
          alignItems: "center",
          gap: 15,
          paddingBottom: 100,
        }}
      >
        {reps.map((rep) => (
          <Itens
            key={rep.id}
            numero_series={rep.numero_serie}
            modelo={rep.modelo}
            cliente={rep.cliente}
            status={rep.status}
          />
        ))}
      </ScrollView>

      <TouchableOpacity style={[styles.fab, {}]}></TouchableOpacity>
      <TouchableOpacity style={[styles.fab, {}]}></TouchableOpacity>
      <TouchableOpacity style={[styles.fab, {transform: position.getTranslateTransform()}]}></TouchableOpacity>
      <TouchableOpacity
        style={[styles.fab, {}]}
        onPress={() => {
          setScanned(false);
          setModalVisible(true);
          requestPermission();
        }}
      >
        <Image
          source={require("../assets/images/qrcode.png")}
          style={{ width: 40, height: 40 }}
        />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="fade">
        {permission?.granted ? (
          <>
            <Image
              style={{
                zIndex: 999,
                width: 300,
                height: 300,
                position: "absolute",
                top: 250,
                left: "50%",
                transform: [{ translateX: -150 }],
              }}
              source={require("../assets/images/qr-scan.png")}
            />
            <CameraView
              style={{ flex: 1 }}
              barcodeScannerSettings={{
                barcodeTypes: ["qr", "pdf417", "code128"],
              }}
              onBarcodeScanned={handleBarCodeScanned}
            />
          </>
        ) : (
          <View style={styles.permissionDenied}>
            <Text>
              Permissão da câmera negada. Vá nas configurações e ative.
            </Text>
          </View>
        )}
        <TouchableOpacity
          onPress={() => setModalVisible(false)}
          style={styles.closeButton}
        >
          <Text style={{ color: "#fff", fontSize: 16 }}>Fechar</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    alignItems: "center",
    gap: 15,
  },
  scrollArea: {
    flexGrow: 0,
    maxHeight: "70%",
    width: "100%",
    alignItems: "center",
    gap: 15,
  },
  scrollContent: {
    alignItems: "center",
    paddingBottom: 100, // pra não colar no botão flutuante
    gap: 15,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 70,
    height: 70,
    backgroundColor: "#B8B8B8",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 35,
  },
  closeButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    padding: 10,
    backgroundColor: "#000",
    borderRadius: 8,
  },
  permissionDenied: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
