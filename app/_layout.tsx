import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/components/useColorScheme";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
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
          name="infoEdit"
          options={{ presentation: "modal", title: "Edit Information" }}
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
}
