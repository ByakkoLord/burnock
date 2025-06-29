import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  TextInput,
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
import SkeletonItens from "./components/SkeletonItens";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
  Poppins_500Medium,
} from "@expo-google-fonts/poppins";

SplashScreen.preventAutoHideAsync();

type Rep = {
  numero_serie: string;
  modelo: string;
  cliente: string;
  status: string;
  data_entrada: string;
};

export default function Index() {
  const [repArray, setRepArray] = useState<Rep[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [formsVisible, setFormsVisible] = useState(false);
  const [backButtonVisible, setBackButtonVisible] = useState(true);
  const [qrResult, setQrResult] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const position1 = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const position2 = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const loading = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loadingVisible, setLoadingVisible] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Poppins_500Medium,
  });

  let countAnimation = 0;

  const handleLoadingAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(loading, {
          toValue: { x: 1000, y: 0 },
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(loading, {
          toValue: { x: 0, y: 0 },
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleButtonAnimation = () => {
    if (countAnimation == 0) {
      Animated.timing(position, {
        toValue: { x: -100, y: 0 },
        duration: 500,
        useNativeDriver: true,
      }).start();
      Animated.timing(position1, {
        toValue: { x: -80, y: -80 },
        duration: 500,
        useNativeDriver: true,
      }).start();
      Animated.timing(position2, {
        toValue: { x: 0, y: -100 },
        duration: 500,
        useNativeDriver: true,
      }).start();
      countAnimation++;
    } else {
      Animated.timing(position, {
        toValue: { x: 0, y: 0 },
        duration: 500,
        useNativeDriver: true,
      }).start();
      Animated.timing(position1, {
        toValue: { x: 0, y: 0 },
        duration: 500,
        useNativeDriver: true,
      }).start();
      Animated.timing(position2, {
        toValue: { x: 0, y: 0 },
        duration: 500,
        useNativeDriver: true,
      }).start();
      countAnimation = 0;
    }
  };

  useEffect(() => {
    console.log(showSkeleton + " showSkeletonIndex");
    if (formsVisible) {
      setBackButtonVisible(true);
    } else {
      setBackButtonVisible(false);
    }

    axios
      .get("https://burnock-server.onrender.com/reps")
      .then((response: AxiosResponse) => {
        setRepArray(response.data);
        console.log("Dados recebidos:", response.data);
        setShowSkeleton(false);
        setLoadingVisible(false);
      })
      .catch((error: Error) => {
        console.error("Erro ao buscar dados:", error);
      });

    const prepareApp = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await SplashScreen.hideAsync();
    };
    prepareApp();
  }, [refreshTrigger]);

  const handleBarCodeScanned = (result: BarcodeScanningResult) => {
    if (!scanned) {
      setScanned(true);
      console.log("QR Code escaneado:", result.data);
      setModalVisible(false);
      setQrResult(result.data);
      (async () => {
        try {
          const response = await axios.get(
            `https://burnock-server.onrender.com/reps/${result.data}`
          );

          if (response.data && response.data.numero_serie) {
            console.log(
              "Número de série já existe:",
              response.data.numero_serie
            );
            return;
          }
        } finally {
          setFormsVisible(true);
        }
      })();
    }
  };

  const reps = repArray
    .filter((rep) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        rep.numero_serie.toLowerCase().includes(searchLower) ||
        rep.modelo.toLowerCase().includes(searchLower) ||
        rep.cliente.toLowerCase().includes(searchLower) ||
        rep.status.toLowerCase().includes(searchLower)
      );
    })
    .map((rep, index) => ({
      id: index + 1,
      numero_serie: rep.numero_serie,
      modelo: rep.modelo,
      cliente: rep.cliente,
      data_entrada: rep.data_entrada,
      status: rep.status,
    }));

  return (
    <View style={styles.container}>
      <View
        style={{
          width: "80%",
          alignItems: "center",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Image
          source={require("../assets/images/search.png")}
          style={{
            width: 20,
            height: 20,
            position: "absolute",
            top: 52,
            left: 15,
            zIndex: 999,
          }}
        />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Digite o SN, Modelo, Cliente ou Fornecedor"
          style={{
            width: "100%",
            height: 45,
            marginTop: 40,
            backgroundColor: "#fff",
            paddingLeft: 50,
            borderRadius: 14,
            fontFamily: "Poppins_400Regular",
          }}
        />
      </View>
      {loadingVisible && (
        <Animated.View
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "row",
            transform: loading.getTranslateTransform(),
            left: -500,
          }}
        >
          <View style={{ height: 2, width: 1000, backgroundColor: "gray" }} />
          <View style={{ height: 2, width: 1000, backgroundColor: "white" }} />
        </Animated.View>
      )}

      <SkeletonItens showSkeleton={showSkeleton} />
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
        style={{ flex: 1, width: "100%", marginTop: 10 }}
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
            data_entrada={rep.data_entrada}
            status={rep.status}
          />
        ))}
      </ScrollView>

      <TouchableOpacity
        onPress={() => {
          handleButtonAnimation();
        }}
        style={[styles.fab, { zIndex: 999 }]}
      >
        <Image
          source={require("../assets/images/menu.png")}
          style={{ width: 40, height: 40 }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.fab, { transform: position.getTranslateTransform() }]}
      >
        <Image
          source={require("../assets/images/barcode.png")}
          style={{ width: 40, height: 40 }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setRefreshTrigger((prev) => prev + 1);
          setLoadingVisible(true);
          handleLoadingAnimation();
        }}
        style={[styles.fab, { transform: position2.getTranslateTransform() }]}
      >
        <Image
          source={require("../assets/images/reload.png")}
          style={{ width: 40, height: 40 }}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.fab, { transform: position1.getTranslateTransform() }]}
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
    backgroundColor: "#BEBEBE",
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
    borderWidth: 1,
    right: 20,
    bottom: 30,
    width: 70,
    height: 70,
    backgroundColor: "white",
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
