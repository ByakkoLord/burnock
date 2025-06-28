import { Text, View, Modal, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as SplashScreen from "expo-splash-screen";
import axios, { AxiosResponse } from "axios";

import Itens from "./components/Itens";

SplashScreen.preventAutoHideAsync();

type Rep = {
  numero_serie: string;
  modelo: string;
  cliente: string;
  status: string;
};

export default function Index() {
  const [repArray, setRepArray] = React.useState<Rep[]>([]);

  useEffect(() => {
    axios
      .get("https://burnock-server.onrender.com/reps")
      .then((response: AxiosResponse) => {
        console.log(response.data);
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

  const reps = repArray.map((rep, index) => ({
    id: index + 1,
    numero_serie: rep.numero_serie,
    modelo: rep.modelo,
    cliente: rep.cliente,
    status: rep.status,
  }));

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 15,
      }}
    ><View style={{overflowY: "auto", maxHeight: "70%", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 15}}>
      {reps.map((rep) => (
        <Itens
          key={rep.id}
          numero_series={rep.numero_serie}
          modelo={rep.modelo}
          cliente={rep.cliente}
          status={rep.status}
        />
      ))}
    </View>
      <TouchableOpacity
        onPressIn={() => {
          axios.post("https://burnock-server.onrender.com/sendrep", {
            numero_serie: "123456",
            data_entrada: new Date().toISOString(), // data no formato ISO
            data_saida: null, // ou "" se preferir
            relatorio: "",
            modelo: "Modelo X",
            cliente: "Cliente Y",
            status: "Ativo",
          });
        }}
        style={{
          position: "fixed",
          right: 45,
          bottom: 30,
          width: 70,
          height: 70,
          backgroundColor: "#B8B8B8",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "50%",
        }}
        onPress={() => {}}
      ></TouchableOpacity>

      {/*<Modal visible={true} animationType="slide">
        <CameraView style={{ flex: 1, width: 300, height: 200, position: "absolute", top: 500, left: 50 }} onBarcodeScanned={( qrCode ) => {console.log(qrCode.data)}}/>
      </Modal>*/}
    </View>
  );
}
