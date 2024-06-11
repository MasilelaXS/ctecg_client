import { useState, useEffect } from "react";
import {
  Image,
  View,
  Pressable,
  ScrollView,
  useColorScheme,
  Platform,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Text as ThemedText, View as ThemedView } from "@/components/Themed";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import styles from "@/components/Styles";
import { Link, router } from "expo-router";
import { useAuth } from "@/context/Auth";
import useToast from "@/components/toast";
import Menu from "@/components/menu";

export default function TabOneScreen() {
  let colorScheme = useColorScheme();
  let iconColor = colorScheme === "dark" ? "white" : "black";
  const { width } = Dimensions.get("window");
  const { userID, menuStatus, connection, hideMenu } = useAuth();
  const toast = useToast();

  const Ad = "https://ctecg.co.za/ctecg_api/Ads/ad.png";

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [adLoaded, setAd] = useState(true);

  const handleAdNotLoaded = () => {
    setAd(false);
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://ctecg.co.za/ctecg_api/getDashboardData.php?customerid=" +
          userID
      );
      const jsonData = await response.json();
      setData(jsonData);

      if (jsonData.customer_details == null) {
        router.replace("/error");
      }
    } catch (error) {
      toast("Unable to Connect.", false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!connection) {
      router.replace("./error");
    } else {
      fetchData();
    }
    hideMenu();
  }, []);

  return (
    <ThemedView style={styles.container}>
      {loading ? (
        <ThemedView
          style={[
            styles.innerContainer,
            {
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <ActivityIndicator size="large" color="#cc0000" />
        </ThemedView>
      ) : (
        <ScrollView style={{ width: "100%", paddingVertical: 20 }}>
          <ThemedView style={[styles.innerContainer, { padding: 15 }]}>
            {menuStatus ? <Menu /> : null}
            <ThemedView
              style={styles.gauge3}
              lightColor="rgba(255, 193, 193,.4)"
              darkColor="rgba(250, 225, 225,.2)"
            >
              <ThemedView
                style={styles.gauge2}
                lightColor="rgba(255, 193, 193,.6)"
                darkColor="rgba(250, 225, 225,.2)"
              >
                <ThemedView
                  style={styles.gauge1}
                  lightColor="rgba(255, 193, 193,1)"
                  darkColor="rgba(250, 225, 225,.2)"
                >
                  <ThemedText style={styles.gaugeText}>
                    {data.customer_details.used}
                  </ThemedText>
                  <ThemedText>Used This Month</ThemedText>
                </ThemedView>
              </ThemedView>
            </ThemedView>
            <ThemedView style={styles.separator}></ThemedView>

            {/* Card Full */}
            <ThemedView
              style={styles.cardFullContainer}
              lightColor="rgba(255, 193, 193,1)"
              darkColor="rgba(250, 225, 225,.2)"
            >
              <View style={{ padding: 15 }}>
                <View style={styles.cardHeadContainer}>
                  <ThemedText style={styles.cardTitle}>
                    {data.customer_details.package2} Package
                  </ThemedText>
                  <View style={styles.cardIcon}>
                    <ThemedText>{data.customer_details.speed} </ThemedText>
                    <Ionicons
                      name="swap-vertical-outline"
                      size={15}
                      color={iconColor}
                    />
                  </View>
                </View>
                <ThemedText style={styles.cardText}>
                  {data.customer_details.package1}
                </ThemedText>
              </View>
              <ThemedView
                lightColor="#cc0000"
                darkColor="#ff5959"
                style={{ height: 4 }}
              ></ThemedView>
            </ThemedView>

            <View style={styles.flexRow}>
              {/* Internet Status */}
              <ThemedView
                style={styles.cardContainer}
                lightColor="rgba(255, 193, 193,1)"
                darkColor="rgba(250, 225, 225,.2)"
              >
                <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
                  <View style={styles.cardHeadContainer}>
                    <ThemedText style={styles.cardTitle}>Internet</ThemedText>
                    <View style={styles.cardIcon}>
                      <Ionicons
                        name="pulse-outline"
                        size={20}
                        color={iconColor}
                      />
                    </View>
                  </View>
                  <ThemedText style={styles.cardText}>Stable</ThemedText>
                </View>
                <ThemedView
                  lightColor="#cc0000"
                  darkColor="#ff5959"
                  style={{ height: 4 }}
                ></ThemedView>
              </ThemedView>

              {/* Account Status */}
              <ThemedView
                style={styles.cardContainer}
                lightColor="rgba(255, 193, 193,1)"
                darkColor="rgba(250, 225, 225,.2)"
              >
                <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
                  <View style={styles.cardHeadContainer}>
                    <ThemedText style={styles.cardTitle}>Account</ThemedText>
                    <View style={styles.cardIcon}>
                      <Ionicons
                        name="receipt-outline"
                        size={20}
                        color={iconColor}
                      />
                    </View>
                  </View>

                  <ThemedText style={styles.cardText}>
                    <Link href="/bill">{data.customer_details.status}</Link>
                  </ThemedText>
                </View>
                <ThemedView
                  lightColor="#cc0000"
                  darkColor="#ff5959"
                  style={{ height: 4 }}
                ></ThemedView>
              </ThemedView>
            </View>

            {adLoaded ? (
              <Link href="/modal" asChild>
                <Pressable style={{ marginTop: 15 }}>
                  <Image
                    source={{ uri: Ad }}
                    style={{ width: width * 0.92, height: 188 }}
                    resizeMode="contain"
                    resizeMethod="scale"
                    onError={handleAdNotLoaded}
                  />
                </Pressable>
              </Link>
            ) : null}
            {/* <Button linkUrl="" btnText="Hello World" btnBorder={false} />
          <Button linkUrl="" btnText="Hello World" btnBorder={true} /> */}
          </ThemedView>
        </ScrollView>
      )}

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </ThemedView>
  );
}
