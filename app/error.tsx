import React from "react";
import { useColorScheme, Platform } from "react-native";
import { Text as ThemedText, View as ThemedView } from "@/components/Themed";
import Button from "@/components/Button";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

const Error = () => {
  let colorScheme = useColorScheme();
  let iconColor = colorScheme === "dark" ? "white" : "black";
  return (
    <ThemedView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 15,
      }}
    >
      <Ionicons name="cloud-offline-outline" size={140} color={iconColor} />
      <ThemedText
        style={{ textAlign: "center", marginTop: 40, marginBottom: 30 }}
      >
        Could not connect to server. Make sure you are connected to the internet
        and try again in few moments.
      </ThemedText>

      <ThemedView
        style={{
          position: "absolute",
          width: "100%",
          bottom: 45,
        }}
      >
        <Button
          linkUrl="https://wa.me//27769790642"
          btnText="Chat With Us"
          btnBorder={true}
        />
        <ThemedText style={{ textAlign: "center" }}>
          24/7 Support 076 979 0642
        </ThemedText>
      </ThemedView>

      {/* Use a light status bar on iOS to account for the black space above the
      modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </ThemedView>
  );
};

export default Error;
