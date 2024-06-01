import { Stack } from "expo-router";
import React from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "@/components/useColorScheme";

const AppLayout = () => {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="error"
          options={{ title: "Error", headerShown: false }}
        />
        <Stack.Screen
          name="invoice/[id]"
          options={{ title: "Invoice Details" }}
        />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Refer a Friend" }}
        />
        <Stack.Screen
          name="fiber"
          options={{ presentation: "modal", title: "Fiber Connection" }}
        />
        <Stack.Screen
          name="ticket"
          options={{ presentation: "modal", title: "Open Ticket" }}
        />
        <Stack.Screen
          name="offline"
          options={{ presentation: "modal", title: "Troubleshoot" }}
        />
      </Stack>
    </ThemeProvider>
  );
};

export default AppLayout;
