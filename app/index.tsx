import { Text, View, Modal } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Modal visible={true} animationType="slide">
        <CameraView style={{ flex: 1, width: 300, height: 200, position: "absolute", top: 500, left: 50 }} />
      </Modal>
    </View>
  );
}
