import { useState, useEffect } from "react";
import {
  Platform,
  View,
  useColorScheme,
  ImageBackground,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from "react-native";
import { Text as ThemedText, View as ThemedView } from "@/components/Themed";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import styles from "@/components/Styles";
import Ad from "@/assets/images/card.png";
import { router } from "expo-router";
import Button from "@/components/Button";
import InvoiceItem from "@/components/invoiceItem";

export default function Bill() {
  let colorScheme = useColorScheme();
  let iconColor = colorScheme === "dark" ? "white" : "black";

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { width } = Dimensions.get("window");

  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://ctecg.co.za/ctecg_api/getInvoiceData.php?customerid=2021"
      );
      const jsonData = await response.json();
      setData(jsonData);

      if (jsonData.customer_details == null) {
        router.replace("/error");
      }
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
        <ThemedView style={styles.innerContainer}>
          <View style={{ padding: 15 }}>
            <ImageBackground
              source={Ad}
              resizeMode="contain"
              style={{
                width: width * 0.92,
                height: 200,
                borderRadius: 15,
                paddingHorizontal: 15,
                justifyContent: "center",
              }}
              resizeMethod="scale"
            >
              <ThemedText lightColor="#fff" style={{ fontSize: 20 }}>
                {data.customer_details.name}
              </ThemedText>
              <ThemedText
                lightColor="#fff"
                style={{ fontSize: 15, fontWeight: "bold" }}
              >
                {data.customer_details.invoicingid}
              </ThemedText>
            </ImageBackground>

            <View style={styles.flexRow}>
              {/* Payment Method */}
              <ThemedView
                style={styles.cardContainer}
                lightColor="rgba(255, 193, 193,1)"
                darkColor="rgba(250, 225, 225,.2)"
              >
                <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
                  <View style={styles.cardHeadContainer}>
                    <ThemedText style={styles.cardTitle}>
                      Payment Method
                    </ThemedText>
                    <View style={styles.cardIcon}>
                      <Ionicons
                        name="card-outline"
                        size={20}
                        color={iconColor}
                      />
                    </View>
                  </View>
                  <ThemedText style={styles.cardText}>
                    {data.customer_details.paymentMethod}
                  </ThemedText>
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
                    {data.customer_details.status}
                  </ThemedText>
                </View>
                <ThemedView
                  lightColor="#cc0000"
                  darkColor="#ff5959"
                  style={{ height: 4 }}
                ></ThemedView>
              </ThemedView>
            </View>

            <View style={styles.flexRow}>
              {/* Amount Due */}
              <ThemedView
                style={styles.cardContainer}
                lightColor="rgba(255, 193, 193,1)"
                darkColor="rgba(250, 225, 225,.2)"
              >
                <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
                  <View style={styles.cardHeadContainer}>
                    <ThemedText style={styles.cardTitle}>Amount Due</ThemedText>
                    <View style={styles.cardIcon}>
                      <Ionicons
                        name="cash-outline"
                        size={20}
                        color={iconColor}
                      />
                    </View>
                  </View>
                  <ThemedText style={styles.cardText}>
                    {data.customer_details.statement}
                  </ThemedText>
                </View>
                <ThemedView
                  lightColor="#cc0000"
                  darkColor="#ff5959"
                  style={{ height: 4 }}
                ></ThemedView>
              </ThemedView>

              {/* Credit */}
              <ThemedView
                style={styles.cardContainer}
                lightColor="rgba(255, 193, 193,1)"
                darkColor="rgba(250, 225, 225,.2)"
              >
                <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
                  <View style={styles.cardHeadContainer}>
                    <ThemedText style={styles.cardTitle}>
                      Credit Amount
                    </ThemedText>
                    <View style={styles.cardIcon}>
                      <Ionicons
                        name="reader-outline"
                        size={20}
                        color={iconColor}
                      />
                    </View>
                  </View>
                  <ThemedText style={styles.cardText}>
                    {data.customer_details.credit_amount_remaining}
                  </ThemedText>
                </View>
                <ThemedView
                  lightColor="#cc0000"
                  darkColor="#ff5959"
                  style={{ height: 4 }}
                ></ThemedView>
              </ThemedView>
            </View>
          </View>
          <View style={{ width: "100%", paddingHorizontal: 15 }}>
            <Button linkUrl="" btnText="Request Invoice" btnBorder={false} />
            <Button linkUrl="" btnText="Request Statement" btnBorder={false} />
          </View>

          {/* <FlatList
            style={{ width: "100%", paddingHorizontal: 15 }}
            data={data.invoices}
            keyExtractor={(invoice) => invoice.id}
            renderItem={({ item: invoice }) => (
              <InvoiceItem
                amount={"R" + invoice.amount}
                invDate={invoice.invoicedate}
                paymentstatus={invoice.paymentstatus}
                invid={invoice.id}
              />
            )}
          /> */}

          {/* <Button linkUrl="" btnText="Request Statement" btnBorder={false} /> */}
          {/* <Button linkUrl="" btnText="Hello World" btnBorder={false} />
          <Button linkUrl="" btnText="Hello World" btnBorder={true} /> */}
        </ThemedView>
      )}
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </ThemedView>
  );
}
