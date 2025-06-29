import React, { useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
} from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
  Poppins_500Medium,
} from "@expo-google-fonts/poppins";

interface FormsProps {
  formVisible: boolean;
  result: string;
}

export default function Forms({ formVisible, result }: FormsProps) {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Poppins_500Medium,
  });

  const handleSendRep = async () => {
    axios
      .post("https://burnock-server.onrender.com/sendrep", {
        numero_serie: result,
        data_entrada: new Date().toISOString(),
        data_saida: null, // Aqui você pode substituir por um valor real
        relatorio: "https://example.com/relatorio", // Aqui você pode substituir por um valor real
        modelo: "Modelo Exemplo", // Aqui você pode substituir por um valor real
        cliente: "", // Aqui você pode substituir por um valor real
        status: "", // Aqui você pode substituir por um valor real
      })
      .catch((error: Error) => {
        console.error("Erro ao enviar dados:", error);
      })
      .then(() => {
        console.log("Dados enviados com sucesso:", result);
      });
  };

  return (
    <>
      {formVisible && (
        <View
          style={{
            width: 400,
            height: 700,
            backgroundColor: "white",
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            marginTop: 200,
            borderRadius: 20,
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins_700Bold",
              fontSize: 20,
              marginBottom: 5,
              marginLeft: 50,
              alignSelf: "flex-start",
            }}
          >
            Número de série
          </Text>
          <TextInput
            value={result}
            style={styles.input}
            placeholder="Digite o Número de Série"
          />
          <Text
            style={{
              fontFamily: "Poppins_700Bold",
              fontSize: 20,
              marginBottom: 5,
              marginLeft: 50,
              alignSelf: "flex-start",
            }}
          >
            Modelo
          </Text>
          <TextInput style={styles.input} placeholder="Digite o Modelo" />
          <Text
            style={{
              fontFamily: "Poppins_700Bold",
              fontSize: 20,
              marginBottom: 5,
              marginLeft: 50,
              alignSelf: "flex-start",
            }}
          >
            Cliente
          </Text>
          <TextInput style={styles.input} placeholder="Digite o Cliente" />
          <Text
            style={{
              fontFamily: "Poppins_700Bold",
              fontSize: 20,
              marginBottom: 5,
              marginLeft: 50,
              alignSelf: "flex-start",
            }}
          >
            Relatório
          </Text>
          <TextInput
            multiline={true}
            numberOfLines={6}
            style={[styles.input, { height: 200, textAlignVertical: "top" }]}
            placeholder="Digite o relatório"
          />
          <TouchableOpacity
            onPress={() => {
              handleSendRep();
            }}
            style={{
              width: 100,
              height: 40,
              backgroundColor: "gray",
              borderRadius: 15,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Text
              style={{
                color: "white",
                fontFamily: "Poppins_500Medium",
                textAlign: "center",
                fontSize: 16,
              }}
            >
              Registrar
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    width: "80%",
    height: 40,
    backgroundColor: "#F0F0F0",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});
