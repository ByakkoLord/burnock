import { View, Image, Text } from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
  Poppins_500Medium,
} from "@expo-google-fonts/poppins";
import { useEffect, useState } from "react";

interface ItensProps {
  numero_series: string;
  modelo: string;
  cliente: string;
  data_entrada?: string;
  status: string;
}

// Mapeamento das imagens por prefixo
const imageMap: { [prefixo: string]: any } = {
  "00014": require("../../assets/images/itens/idclass671.jpg"),
  "00004": require("../../assets/images/itens/henryPrisma.jpg"),
  // Adicione mais prefixos conforme necessário
};

// Função para selecionar a imagem com base nos 5 primeiros caracteres
function getImageBySerie(numero_series: string) {
  const prefix = numero_series.substring(0, 5).toUpperCase();
  return imageMap[prefix] || require("../../assets/images/search.png");
}

export default function Itens({
  numero_series,
  modelo,
  cliente,
  status,
  data_entrada,
}: ItensProps) {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Poppins_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        width: "80%",
        height: 119,
        backgroundColor: "#F0F0F0",
        borderRadius: 14,
      }}
    >
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "flex-start",
          gap: 12,
          marginLeft: 32,
          alignItems: "center",
        }}
      >
        <Image
          source={getImageBySerie(numero_series)}
          style={{
            width: 90,
            height: 91,
            borderRadius: 25,
            backgroundColor: "#ACACAC",
          }}
        />
        <View>
          <Text style={{ color: "#5E5E5E", fontFamily: "Poppins_500Medium" }}>
            SN: {numero_series}
          </Text>
          <Text style={{ color: "#5E5E5E", fontFamily: "Poppins_400Regular" }}>
            Modelo: {modelo}
          </Text>
          <Text style={{ color: "#5E5E5E", fontFamily: "Poppins_400Regular" }}>
            Cliente: {cliente}
          </Text>
          <Text style={{ color: "#CD8686", fontFamily: "Poppins_700Bold" }}>
          {status}
          </Text>
        </View>
      </View>
    </View>
  );
}
