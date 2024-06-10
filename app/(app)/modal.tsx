import { StatusBar } from "expo-status-bar";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Image,
  View,
  Alert,
  Pressable,
  Text,
} from "react-native";
import { Text as ThemedText, View as ThemedView } from "@/components/Themed";
import styles from "@/components/Styles";
import Toast from "react-native-root-toast";
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
  info1: string;
};

// Ensure useAuth() is properly typed
type AuthContextType = {
  userID: string | null;
};

export default function ModalScreen() {
  const Ad = "https://ctecg.co.za/ctecg_api/Ads/ad.png";

  const [name, setName] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [town, setTown] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [info, setInfo] = useState<string>("");
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  const { userID } = useAuth() as AuthContextType;

  let toast = (toastMessage: string) => Toast.show(toastMessage, {
    duration: Toast.durations.SHORT,
    animation: true,
    hideOnPress: true,
    backgroundColor: "#cc0000",
    textColor: "#fff",
    opacity: 0.8
  });

  // Function to send email
  const sendEmail = async ({
    customer_id,
    name1,
    contact1,
    email1,
    address1,
    town1,
    code1,
    info1,
  }: SendEmailParams): Promise<void> => {
    try {
      const url = `https://ctecg.co.za/ctecg_api/referMail.php?customerid=${encodeURIComponent(
        customer_id
      )}&name=${encodeURIComponent(name1)}&contact=${encodeURIComponent(
        contact1
      )}&email=${encodeURIComponent(email1)}&address=${encodeURIComponent(
        address1
      )}&town=${encodeURIComponent(town1)}&code=${encodeURIComponent(
        code1
      )}&info=${encodeURIComponent(info1)}`;
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
        toast("One of our agent will contact you within 24 hours.");
        setBtnLoading(false);
        setName("");
        setContact("");
        setEmail("");
        setAddress("");
        setTown("");
        setCode("");
        setInfo("");
      }
    } catch (error) {
      toast("Unable to Connect.");
      setBtnLoading(false);
    }
  };

  // Ensure other variables are of type string or provide default values
  const handleEmail = () => {
    setBtnLoading(true);
    if (userID === null) {
      toast("Unable to Connect.");
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
        info1: info,
      });
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <KeyboardAvoidingView style={[styles.innerContainer, { padding: 15 }]}>
          <Image
            source={{ uri: Ad }}
            style={{ width: 370, height: 180, marginTop: 15, borderRadius: 15 }}
          />
          <View style={{ width: "100%" }}>
            <View style={styles.InputTitle}>
              <ThemedText>Full Name</ThemedText>
            </View>
            <TextInput
              placeholder="Enter their full name"
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
              placeholder="Enter their contact number"
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
              placeholder="Enter their email"
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
              placeholder="Enter their physical address"
              multiline={true}
              style={styles.Input}
              value={address}
              onChangeText={(text) => setAddress(text)}
            />
          </View>

          <View style={{ width: "100%" }}>
            <View style={styles.InputTitle}>
              <ThemedText>City/Town</ThemedText>
            </View>
            <TextInput
              placeholder="Enter their city or town"
              multiline={true}
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
              placeholder="Enter their postal code"
              keyboardType="phone-pad"
              style={styles.Input}
              value={code}
              onChangeText={(text) => setCode(text)}
            />
          </View>

          <View style={{ width: "100%" }}>
            <View style={styles.InputTitle}>
              <ThemedText>Other Information</ThemedText>
            </View>
            <TextInput
              placeholder="Enter additional information"
              multiline={true}
              numberOfLines={4}
              style={[{ textAlignVertical: "top" }, styles.Input]}
              value={info}
              onChangeText={setInfo}
            />
          </View>

          <ThemedText style={{ marginTop: 15 }}>
            It is important to note that the complimentary one-month internet
            service will be provided upon the successful finalization of the
            contract.
          </ThemedText>

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
