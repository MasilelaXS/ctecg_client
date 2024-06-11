import { useState, useEffect } from "react";
import {
  Platform,
  View,
  Alert,
  useColorScheme,
  ImageBackground,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  TextInput,
} from "react-native";
import { Text as ThemedText, View as ThemedView } from "@/components/Themed";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import styles from "@/components/Styles";
import Ad from "@/assets/images/card.png";
import { router } from "expo-router";
import { useAuth } from "@/context/Auth";
import useToast from "@/components/toast";

type SendEmailParams = {
  customer_id: string;
  invoicedate: string;
};

type SendEmailParams2 = {
  customer_id: string;
  statementdate: string;
};

// Ensure useAuth() is properly typed
type AuthContextType = {
  userID: string | null;
};

export default function Bill() {
  let colorScheme = useColorScheme();
  let iconColor = colorScheme === "dark" ? "white" : "black";

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [invoiceDate, setInvoiceDate] = useState<string>("");
  const [statementDate, setStatementDate] = useState<string>("");
  const [btnLoading, setBtnLoading] = useState<Boolean>(false);
  const [btnLoading2, setBtnLoading2] = useState<Boolean>(false);

  const { width } = Dimensions.get("window");
  const { userID } = useAuth() as AuthContextType;
  const toast = useToast();

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://ctecg.co.za/ctecg_api/getInvoiceData.php?customerid=" + userID
      );
      const jsonData = await response.json();
      setData(jsonData);

      if (jsonData.customer_details == null) {
        router.replace("/error");
      }
    } catch (error) {
      toast("Please Make Sure You Have Internet Access and Try Again.", false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Function to send email
  const sendInvoice = async ({
    customer_id,
    invoicedate,
  }: SendEmailParams): Promise<void> => {
    try {
      const url = `https://ctecg.co.za/ctecg_api/invoiceMail.php?customerid=${encodeURIComponent(
        customer_id
      )}&invoicedate=${encodeURIComponent(invoicedate)}`;

      if (invoiceDate == "") {
        toast("Please Enter Invoice Month.", false);
        setBtnLoading(false);
      } else{
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const responseData = await response.json();
        if (responseData.error) {
          toast("Unable to Connect.", false);
          setBtnLoading(false);
        } else {
          toast("Invoice will be sent to you within 24 hours.", false);
          setBtnLoading(false);
          setInvoiceDate("");
        }
      }

      
    } catch (error) {
      toast("Unable to Connect.", false);
      setBtnLoading(false);
    }
  };

  // Function to send email
  const sendStatement = async ({
    customer_id,
    statementdate,
  }: SendEmailParams2): Promise<void> => {
    try {
      const url = `https://ctecg.co.za/ctecg_api/statementMail.php?customerid=${encodeURIComponent(
        customer_id
      )}&statementdate=${encodeURIComponent(statementdate)}`;

      if (statementDate == "") {
        toast("Please Enter Statement Month.", false);
        setBtnLoading2(false);
      } else{
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const responseData = await response.json();
        if (responseData.error) {
          toast("Unable to Connect.", false);
          setBtnLoading2(false);
        } else {
          toast("Invoice will be sent to you within 24 hours.", false);
          setBtnLoading2(false);
          setInvoiceDate("");
        }
      }
    } catch (error) {
      toast("Unable to Connect.", false);
      setBtnLoading2(false);
    }
  };

  // Ensure other variables are of type string or provide default values
  const handleInvoiceEmail = () => {
    setBtnLoading(true);
    if (userID === null) {
      toast("Something wrong. Please Try Again", false);
      setBtnLoading(false);
      return;
    } else {
      sendInvoice({
        customer_id: userID,
        invoicedate: invoiceDate.toLocaleUpperCase(),
      });
    }
  };

  // Ensure other variables are of type string or provide default values
  const handleStatementEmail = () => {
    setBtnLoading2(true);
    if (userID === null) {
      toast("Something wrong. Please Try Again", false);
      setBtnLoading2(false);
      return;
    } else {
      sendStatement({
        customer_id: userID,
        statementdate: statementDate.toLocaleUpperCase(),
      });
    }
  };

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
        <ScrollView>
          <KeyboardAvoidingView
            style={{
              flex: 1,
              padding: 15,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View>
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
                      <ThemedText style={styles.cardTitle}>
                        Amount Due
                      </ThemedText>
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
            <View style={{ width: "100%" }}>
              <ThemedText
                style={{
                  marginTop: 15,
                  width: "100%",
                }}
              >
                Request Invoice
              </ThemedText>
              <View
                style={[
                  styles.Input,
                  {
                    marginVertical: 15,
                    flexDirection: "row",
                    alignItems: "center",
                    overflow: "hidden",
                  },
                ]}
              >
                <Ionicons name="calendar-outline" size={20} />
                <TextInput
                  placeholder="Enter month and year"
                  value={invoiceDate}
                  onChangeText={(text) => setInvoiceDate(text)}
                  autoCapitalize="words"
                  // keyboardType="phone-pad"
                  style={{
                    paddingHorizontal: 15,
                    flex: 1,
                  }}
                />
                <Pressable
                  onPress={() => handleInvoiceEmail()}
                  style={{
                    paddingHorizontal: 15,
                    paddingVertical: 5,
                  }}
                >
                  {btnLoading ? (
                    <ThemedText
                      style={{ fontWeight: "bold", color: "#cc0000" }}
                    >
                      Requesting...
                    </ThemedText>
                  ) : (
                    <ThemedText
                      style={{ fontWeight: "bold", color: "#cc0000" }}
                    >
                      Request
                    </ThemedText>
                  )}
                </Pressable>
              </View>

              <ThemedText
                style={{
                  width: "100%",
                }}
              >
                Request Statement
              </ThemedText>
              <View
                style={[
                  styles.Input,
                  {
                    marginVertical: 15,
                    flexDirection: "row",
                    alignItems: "center",
                    overflow: "hidden",
                  },
                ]}
              >
                <Ionicons name="calendar-outline" size={20} />
                <TextInput
                  placeholder="Enter month and year"
                  autoCapitalize="words"
                  value={statementDate}
                  onChangeText={(text) => setStatementDate(text)}
                  // keyboardType="phone-pad"
                  style={{
                    paddingHorizontal: 15,
                    flex: 1,
                  }}
                />
                {btnLoading2 ? (
                  <Pressable
                    style={{
                      paddingHorizontal: 15,
                      paddingVertical: 5,
                    }}
                  >
                    <ThemedText
                      style={{ fontWeight: "bold", color: "#cc0000" }}
                    >
                      Requesting...
                    </ThemedText>
                  </Pressable>
                ) : (
                  <Pressable
                    style={{
                      paddingHorizontal: 15,
                      paddingVertical: 5,
                    }}
                    onPress={() => handleStatementEmail()}
                  >
                    <ThemedText
                      style={{ fontWeight: "bold", color: "#cc0000" }}
                    >
                      Request
                    </ThemedText>
                  </Pressable>
                )}
              </View>

              {/* <Link
                href={{
                  pathname: "/invoiceList",
                  params: { invoices: JSON.stringify(data.invoices) },
                }}
                asChild
              >
                <Pressable style={styles.btn}>
                  <ThemedText style={{ color: "#fff" }}>
                    See Invoices
                  </ThemedText>
                </Pressable>
              </Link> */}
            </View>

            {/* <Button linkUrl="" btnText="Request Statement" btnBorder={false} /> */}
            {/* <Button linkUrl="" btnText="Hello World" btnBorder={false} />
          <Button linkUrl="" btnText="Hello World" btnBorder={true} /> */}
          </KeyboardAvoidingView>
        </ScrollView>
      )}
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </ThemedView>
  );
}
