import { View, Image, Text } from "react-native";
import { useFonts, Poppins_400Regular, Poppins_700Bold, Poppins_500Medium } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading'; 
interface ItensProps {
  numero_series: string;
  modelo: string;
  cliente: string;
  status: string;
}
export default function Itens({ numero_series, modelo, cliente, status }: ItensProps) {
     const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Poppins_500Medium,
  });
    if (!fontsLoaded) {
        return <AppLoading />;
    }

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        width: "80%",
        height: 119,
        backgroundColor: "#D8D8D8",
        borderRadius: 14,
      }}
    >
      <View style={{ width: "100%" ,flexDirection: "row", justifyContent: "flex-start", gap: 12, marginLeft: 32, alignItems: "center" }}>
        <Image
          style={{ width: 90, height: 91, borderRadius: 25, backgroundColor: "#ACACAC" }}
        />
        <View>
          <Text style={{ color: "#5E5E5E" ,fontFamily: 'Poppins_500Medium' }}>SN: {numero_series}</Text>
          <Text style={{ color: "#5E5E5E" ,fontFamily: 'Poppins_500Medium' }}>Modelo: {modelo}</Text>
          <Text style={{ color: "#5E5E5E" ,fontFamily: 'Poppins_500Medium' }}>Cliente: {cliente}</Text>
          <Text style={{ color: "#CD8686", fontFamily: 'Poppins_500Medium' }}>{status}</Text>
        </View>
      </View>
    </View>
  );
}
