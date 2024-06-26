import { View, Text, useColorScheme, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { Text as ThemedText, View as ThemedView } from "@/components/Themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import styles from "@/components/Styles";
import { useAuth } from "@/context/Auth";
import { Link } from "expo-router";

const Menu = () => {
  let colorScheme = useColorScheme();
  let iconColor = colorScheme === "dark" ? "white" : "black";
  let borderColor = colorScheme === "dark" ? "#434349" : "#E6E6E8";
  const [username, setUsername] = useState<string | null>();

  useEffect(() => {
    const getUname = async () => {
      const storedName = await AsyncStorage.getItem("username");
      setUsername(storedName);
    };

    getUname();
  }, []);

  const { hideMenu, signOut } = useAuth();
  return (
    <ThemedView
      lightColor="rgba(248,248,247,.98)"
      darkColor="rgba(46,46,51,.98)"
      style={styles.floatingMenu}
    >
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 15,
        }}
      >
        {username !== null ? (
          <View>
            <ThemedText style={{ fontSize: 16, fontWeight: "300" }}>
              Hi {username}
            </ThemedText>
          </View>
        ) : (
          <ThemedText style={styles.cardTitle}>Menu</ThemedText>
        )}
        <Pressable onPress={() => hideMenu()}>
          <Ionicons name="close-outline" color={iconColor} size={25} />
        </Pressable>
      </View>

      <Link href="/modal" asChild>
        <Pressable onPress={() => hideMenu()}>
          {({ pressed }) => (
            <View
              style={[
                styles.menuItem,
                {
                  borderBottomColor: borderColor,
                  borderBottomWidth: 1,
                  opacity: pressed ? 0.5 : 1,
                },
              ]}
            >
              <View>
                <ThemedText>Refer a Friend</ThemedText>
              </View>

              <Ionicons name="person-add-outline" color={iconColor} size={20} />
            </View>
          )}
        </Pressable>
      </Link>

      <Link href="/fiber" asChild>
        <Pressable onPress={() => hideMenu()}>
          {({ pressed }) => (
            <View
              style={[
                styles.menuItem,
                {
                  borderBottomColor: borderColor,
                  borderBottomWidth: 1,
                  opacity: pressed ? 0.5 : 1,
                },
              ]}
            >
              <View>
                <ThemedText>Ugrade To Fibre</ThemedText>
              </View>
              <Ionicons name="wifi-outline" color={iconColor} size={20} />
            </View>
          )}
        </Pressable>
      </Link>
      <Link href="/offline" asChild>
        <Pressable onPress={() => hideMenu()}>
          {({ pressed }) => (
            <View
              style={[
                styles.menuItem,
                {
                  borderBottomColor: borderColor,
                  borderBottomWidth: 1,
                  opacity: pressed ? 0.5 : 1,
                },
              ]}
            >
              <View>
                <ThemedText>Troubleshoot</ThemedText>
              </View>
              <Ionicons name="cellular-outline" color={iconColor} size={20} />
            </View>
          )}
        </Pressable>
      </Link>

      <Link href="https://wa.me//27769790642" asChild>
        <Pressable onPress={() => hideMenu()}>
          {({ pressed }) => (
            <View
              style={[
                styles.menuItem,
                {
                  borderBottomColor: borderColor,
                  borderBottomWidth: 1,
                  opacity: pressed ? 0.5 : 1,
                },
              ]}
            >
              <View>
                <ThemedText>Chat With Us</ThemedText>
              </View>
              <Ionicons name="logo-whatsapp" color={iconColor} size={20} />
            </View>
          )}
        </Pressable>
      </Link>

      <Link
        href="https://pay.yoco.com./mzanzi-lisetta-media-and-printing-ptyltd-ta-ctecg"
        asChild
      >
        <Pressable onPress={() => hideMenu()}>
          {({ pressed }) => (
            <View
              style={[
                styles.menuItem,
                {
                  borderBottomColor: borderColor,
                  borderBottomWidth: 1,
                  opacity: pressed ? 0.5 : 1,
                },
              ]}
            >
              <View>
                <ThemedText>Pay Account</ThemedText>
              </View>
              <Ionicons name="wallet-outline" color={iconColor} size={20} />
            </View>
          )}
        </Pressable>
      </Link>

      <Pressable onPress={() => signOut()}>
        {({ pressed }) => (
          <View
            style={[
              styles.menuItem,
              {
                borderBottomColor: borderColor,
                borderBottomWidth: 1,
                opacity: pressed ? 0.5 : 1,
              },
            ]}
          >
            <View>
              <ThemedText>Sign Out</ThemedText>
            </View>
            <Ionicons name="log-out-outline" color={iconColor} size={20} />
          </View>
        )}
      </Pressable>
    </ThemedView>
  );
};

export default Menu;
