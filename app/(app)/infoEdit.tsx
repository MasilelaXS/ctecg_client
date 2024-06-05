import { StatusBar } from "expo-status-bar";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Alert,
  View,
  Pressable,
} from "react-native";
import { Text as ThemedText, View as ThemedView } from "@/components/Themed";
import styles from "@/components/Styles";
import { useState } from "react";
import { useAuth } from "@/context/Auth";

type SendEmailParams = {
  customer_id: string;
  email: string;
  cell: string;
  msg: string;
};

// Ensure useAuth() is properly typed
type AuthContextType = {
  userID: string | null;
};

const InfoEdit = () => {
  const [btnLoading, setBtnLoading] = useState<Boolean>(false);
  const [cellNr, setCell] = useState<string>("");
  const [mail, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const { userID } = useAuth() as AuthContextType;

  // Function to send email
  const sendEmail = async ({
    customer_id,
    cell,
    email,
    msg,
  }: SendEmailParams): Promise<void> => {
    try {
      const url = `https://ctecg.co.za/ctecg_api/infoMail.php?customerid=${encodeURIComponent(
        customer_id
      )}&cell=${encodeURIComponent(cell)}&email=${encodeURIComponent(
        email
      )}&message=${encodeURIComponent(msg)}`;
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
        setCell("");
        setEmail("");
        setMessage("");
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
        cell: cellNr,
        email: mail,
        msg: message,
      });
    }
  };
  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <KeyboardAvoidingView style={[styles.innerContainer, { padding: 15 }]}>
          <View style={{ width: "100%" }}>
            <View style={styles.InputTitle}>
              <ThemedText>Contact Number</ThemedText>
            </View>
            <TextInput
              placeholder="Enter contact number"
              value={cellNr}
              onChangeText={(text) => setCell(text)}
              keyboardType="phone-pad"
              style={styles.Input}
            />
          </View>

          <View style={{ width: "100%" }}>
            <View style={styles.InputTitle}>
              <ThemedText>Email</ThemedText>
            </View>
            <TextInput
              placeholder="Enter email"
              value={mail}
              onChangeText={(text) => setEmail(text)}
              keyboardType="email-address"
              style={styles.Input}
            />
          </View>

          <View style={{ width: "100%" }}>
            <View style={styles.InputTitle}>
              <ThemedText>Other Information</ThemedText>
            </View>
            <TextInput
              placeholder="Enter additional information"
              value={message}
              onChangeText={(text) => setMessage(text)}
              multiline={true}
              numberOfLines={4}
              style={[{ textAlignVertical: "top" }, styles.Input]}
            />
          </View>

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
};

export default InfoEdit;
