import React, { useEffect, useState } from "react";
import { Text, View, Modal, TouchableOpacity, StyleSheet, Image } from "react-native";
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

  useEffect(() => {
    setFormsVisible(true);

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

      {/*
      axios
        .post("https://burnock-server.onrender.com/sendrep", {
          numero_serie: result.data,
          data_entrada: new Date().toISOString(),
          data_saida: null, // Aqui você pode substituir por um valor real
          relatorio: "https://example.com/relatorio", // Aqui você pode substituir por um valor real
          modelo: "Modelo Exemplo", // Aqui você pode substituir por um valor real
          cliente: "Cliente Exemplo", // Aqui você pode substituir por um valor real
          status: "Ativo", // Aqui você pode substituir por um valor real
        })
        .catch((error: Error) => {
          console.error("Erro ao enviar dados:", error);
        })
        .then(() => {
          console.log("Dados enviados com sucesso:", result.data);
        });*/}

      
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
      <Forms formVisible={formsVisible} />
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

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setScanned(false);
          setModalVisible(true);
          requestPermission();
        }}
      >
        <Text style={{ fontSize: 30 }}>📷</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        {permission?.granted ? (
          <>
          <Image
            style={{ zIndex: 999, width: 300, height: 300, position: "absolute", top: 250, left: "50%", transform: [{ translateX: -150 }] }}
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
    elevation: 5,
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
