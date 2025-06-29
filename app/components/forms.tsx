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
  rep: any;
}

export default function Forms({ formVisible, result, rep }: FormsProps) {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Poppins_500Medium,
  });

  const [cliente, setCliente] = React.useState("");
  const [relatorio, setRelatorio] = React.useState("");
  const [modelo, setModelo] = React.useState("");
  const [localStatus, setLocalStatus] = React.useState("");

  const handleSendRep = async () => {
    const response = await axios.get(`https://burnock-server.onrender.com/reps/${result}`);
    console.log("Resposta da busca:");
    
      // Não existe → cria novo
      console.log("Número de série não encontrado, enviando dados...");
      try {
        const sendResponse = await axios.post("https://burnock-server.onrender.com/sendrep", {
          numero_serie: result,
          data_entrada: new Date().toISOString(),
          data_saida: null,
          relatorio: relatorio,
          modelo: modelo,
          cliente: cliente,
          status: "Recebido",
        });
        console.log("Inserção feita com sucesso:", sendResponse.data);
      } catch (err) {
        console.error("Erro ao inserir novo registro:", err);
      
    }

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
          <TextInput
            style={styles.input}
            placeholder="Digite o Modelo"
            onChangeText={setModelo}
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
            Cliente
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o Cliente"
            onChangeText={setCliente}
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
            Relatório
          </Text>
          <TextInput
            onChangeText={setRelatorio}
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
