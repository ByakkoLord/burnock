import { Stack } from "expo-router";
import { ItensProvider } from "./contexts/itensContext";

export default function RootLayout() {
  return (
    <ItensProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ItensProvider>
  );
}
