import { View, Text } from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
  Poppins_500Medium,
} from "@expo-google-fonts/poppins";

export default function Status() {
    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_700Bold,
        Poppins_500Medium,
    });
    if (!fontsLoaded) {
  return null;
    }
  return (
    <View style={{ width: 350, height: 200, backgroundColor: "white", borderRadius: 20, position: "absolute", zIndex: 999, top: 400, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", display: "flex", alignItems: "center" }}>
        <Text style={{ fontFamily: "Poppins_700Bold", fontSize: 18, textAlign: "center", marginTop: 20 }}>O que vai acontecer com este equipamento?</Text>
    </View>
  );
}
