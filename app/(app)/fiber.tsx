import { StatusBar } from "expo-status-bar";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Image,
  Alert,
  Pressable,
  View,
  Linking,
} from "react-native";
import { Text as ThemedText, View as ThemedView } from "@/components/Themed";
import styles from "@/components/Styles";
import Button from "@/components/Button";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import { useAuth } from "@/context/Auth";

type SendEmailParams = {
  customer_id: string;
  name1: string;
  contact1: string;
  email1: string;
  address1: string;
  town1: string;
  code1: string;
};

// Ensure useAuth() is properly typed
type AuthContextType = {
  userID: string | null;
};

export default function ModalScreen() {
  const [name, setName] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [town, setTown] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const { userID } = useAuth() as AuthContextType;

  // Function to send email
  const sendEmail = async ({
    customer_id,
    name1,
    contact1,
    email1,
    address1,
    town1,
    code1,
  }: SendEmailParams): Promise<void> => {
    try {
      const url = `https://ctecg.co.za/ctecg_api/fibreMail.php?customerid=${encodeURIComponent(
        customer_id
      )}&name=${encodeURIComponent(name1)}&contact=${encodeURIComponent(
        contact1
      )}&email=${encodeURIComponent(email1)}&address=${encodeURIComponent(
        address1
      )}&town=${encodeURIComponent(town1)}&code=${encodeURIComponent(code1)}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const responseData = await response.json();
      if (responseData.error) {
        console.log("Error:", responseData.error);
        Alert.alert("Error", responseData.error);
        setBtnLoading(false);
      } else {
        console.log("Response:", responseData);
        Alert.alert("Success", "Email sent successfully!");
        setBtnLoading(false);
        setName("");
        setContact("");
        setEmail("");
        setAddress("");
        setTown("");
        setCode("");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      Alert.alert("Error", "Failed to send email. Please try again.");
      setBtnLoading(false);
    }
  };

  // Ensure other variables are of type string or provide default values
  const handleEmail = () => {
    setBtnLoading(true);
    if (userID === null) {
      Alert.alert("Error", "User ID is null");
      setBtnLoading(false);
      return;
    } else {
      sendEmail({
        customer_id: userID,
        name1: name,
        contact1: contact,
        email1: email,
        address1: address,
        town1: town,
        code1: code,
      });
    }
  };

  const informationModal = () =>
    Alert.alert(
      "Information",
      `Our fiber connection is currently available exclusively in Groblersdal. However, we are excited to announce that we will be expanding to new areas very soon. Stay tuned for more updates as we bring high-speed connectivity to more communities in the near future!`,
      [
        {
          text: "See Packages",
          onPress: () =>
            Linking.openURL(
              "https://www.mzanzisolutions.co.za/bandwidth-packages.html"
            ),
        },
      ],
      { cancelable: true }
    );
  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <KeyboardAvoidingView style={[styles.innerContainer, { padding: 15 }]}>
          <View style={{ width: "100%" }}>
            <View style={styles.InputTitle}>
              <ThemedText>Full Name</ThemedText>
            </View>
            <TextInput
              placeholder="Enter your full name"
              style={styles.Input}
              value={name}
              onChangeText={(text) => setName(text)}
            />
          </View>

          <View style={{ width: "100%" }}>
            <View style={styles.InputTitle}>
              <ThemedText>Contact Number</ThemedText>
            </View>
            <TextInput
              placeholder="Enter contact Number"
              keyboardType="phone-pad"
              style={styles.Input}
              value={contact}
              onChangeText={(text) => setContact(text)}
            />
          </View>

          <View style={{ width: "100%" }}>
            <View style={styles.InputTitle}>
              <ThemedText>Email</ThemedText>
            </View>
            <TextInput
              placeholder="Enter your email"
              keyboardType="email-address"
              style={styles.Input}
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
          </View>

          <View style={{ width: "100%" }}>
            <View style={styles.InputTitle}>
              <ThemedText>Physical Address</ThemedText>
            </View>
            <TextInput
              placeholder=" Enter yout physical address"
              multiline={true}
              numberOfLines={2}
              style={[{ textAlignVertical: "top" }, styles.Input]}
              value={address}
              onChangeText={(text) => setAddress(text)}
            />
          </View>

          <View style={{ width: "100%" }}>
            <View style={styles.InputTitle}>
              <ThemedText>City/Town</ThemedText>
              <Pressable onPress={informationModal}>
                <Ionicons name="information-circle-outline" size={20} />
              </Pressable>
            </View>
            <TextInput
              placeholder="Enter your city or town"
              style={styles.Input}
              value={town}
              onChangeText={(text) => setTown(text)}
            />
          </View>

          <View style={{ width: "100%" }}>
            <View style={styles.InputTitle}>
              <ThemedText>Postal Code</ThemedText>
            </View>
            <TextInput
              placeholder="Enter your postal code"
              keyboardType="phone-pad"
              style={styles.Input}
              value={code}
              onChangeText={(text) => setCode(text)}
            />
          </View>

          <Pressable>
            <ThemedText style={{ marginTop: 15 }}></ThemedText>
          </Pressable>

          {btnLoading ? (
            <Pressable style={styles.btn}>
              <ThemedText style={{ color: "#fff" }}>Please Wait...</ThemedText>
            </Pressable>
          ) : (
            <Pressable onPress={() => handleEmail()} style={styles.btn}>
              <ThemedText style={{ color: "#fff" }}>Submit</ThemedText>
            </Pressable>
          )}
        </KeyboardAvoidingView>
      </ScrollView>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </ThemedView>
  );
}
