import React from "react";
import { View, TextInput, StyleSheet } from "react-native";

interface FormsProps {
  formVisible: boolean;
}

export default function Forms({ formVisible }: FormsProps) {
  return (
    <>
      {formVisible && (
        <View
          style={{
            width: 400,
            height: 400,
            backgroundColor: "white",
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            marginTop: 250,
            borderRadius: 20
          }}
        >
          <TextInput style={styles.input} placeholder="Digite algo..." />
          <TextInput style={styles.input} placeholder="Digite algo..." />
          <TextInput style={styles.input} placeholder="Digite algo..." />
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
