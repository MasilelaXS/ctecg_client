import { useState, useEffect } from "react";
import {
  Image,
  View,
  Platform,
  Pressable,
  ScrollView,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Text as ThemedText, View as ThemedView } from "@/components/Themed";
import Button from "@/components/Button";
import { Ionicons } from "@expo/vector-icons";
import styles from "@/components/Styles";
import Icon from "@/assets/images/user.png";
import { useAuth } from "@/context/Auth";

const Account = () => {
  let colorScheme = useColorScheme();
  let iconColor = colorScheme === "dark" ? "white" : "black";
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { userID, signOut } = useAuth();

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://ctecg.co.za/ctecg_api/getCustomerData.php?customerid=" + userID //2021
      );
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
          <ThemedView
            style={[
              styles.innerContainer,
              { paddingHorizontal: 15, paddingVertical: 20 },
            ]}
          >
            {/* Data Balance */}

            <Pressable style={{ marginTop: 15 }}>
              <Image
                source={Icon}
                style={{ width: 370, height: 180 }}
                resizeMode="contain"
                resizeMethod="scale"
              />
            </Pressable>
            <ThemedView style={styles.separator}></ThemedView>
            <ThemedText style={styles.cardText}>
              {data.customer_details.name}
            </ThemedText>
            <ThemedText style={styles.cardTitle}>
              {data.customer_details.email}
            </ThemedText>

            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                marginTop: 15,
              }}
            >
              <View style={{ paddingRight: 15 }}>
                <Ionicons name="person-outline" size={30} color={iconColor} />
              </View>
              <View>
                <ThemedText style={styles.cardTitle}>Name</ThemedText>
                <ThemedText style={{ fontSize: 25, fontWeight: "200" }}>
                  {data.customer_details.name}
                </ThemedText>
              </View>
            </View>

            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                marginTop: 15,
              }}
            >
              <View style={{ paddingRight: 15 }}>
                <Ionicons
                  name="finger-print-outline"
                  size={30}
                  color={iconColor}
                />
              </View>
              <View>
                <ThemedText style={styles.cardTitle}>Client ID</ThemedText>
                <ThemedText style={{ fontSize: 25, fontWeight: "200" }}>
                  {data.customer_details.invoicingid}
                </ThemedText>
              </View>
            </View>
            {data.customer_details.phone &&
            data.customer_details.phone.m &&
            data.customer_details.phone.m.length > 0
              ? data.customer_details.phone.m.map(
                  (phoneNumber: string, index: number) => (
                    <View
                      key={index}
                      style={{
                        width: "100%",
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 15,
                      }}
                    >
                      <View style={{ paddingRight: 15 }}>
                        <Ionicons
                          name="call-outline"
                          size={30}
                          color={iconColor}
                        />
                      </View>
                      <View>
                        <ThemedText style={styles.cardTitle}>
                          Contact
                        </ThemedText>
                        <ThemedText style={{ fontSize: 25, fontWeight: "200" }}>
                          {phoneNumber}
                        </ThemedText>
                      </View>
                    </View>
                  )
                )
              : null}
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                marginTop: 15,
              }}
            >
              <View style={{ paddingRight: 15 }}>
                <Ionicons name="calendar-outline" size={30} color={iconColor} />
              </View>
              <View>
                <ThemedText style={styles.cardTitle}>
                  Installation Date
                </ThemedText>
                <ThemedText style={{ fontSize: 25, fontWeight: "200" }}>
                  {data.customer_details.installdate}
                </ThemedText>
              </View>
            </View>

            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                marginTop: 15,
              }}
            >
              <View style={{ paddingRight: 15 }}>
                <Ionicons name="navigate-outline" size={30} color={iconColor} />
              </View>
              <View>
                <ThemedText style={styles.cardTitle}>
                  {data.customer_details.county}
                </ThemedText>
                <ThemedText style={{ fontSize: 25, fontWeight: "200" }}>
                  {data.customer_details.town}
                </ThemedText>
                <ThemedText>{data.customer_details.country}</ThemedText>
              </View>
            </View>

            <Button
              linkUrl="/infoEdit"
              btnText="Update Information"
              btnBorder={false}
            />

            <Pressable onPress={() => signOut()} style={styles.btnBorder}>
              <ThemedText>Logout</ThemedText>
            </Pressable>
          </ThemedView>
        </ScrollView>
      )}

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </ThemedView>
  );
};

export default Account;
