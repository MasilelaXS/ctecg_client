import { StatusBar } from "expo-status-bar";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
  Alert,
} from "react-native";
import { Text as ThemedText, View as ThemedView } from "@/components/Themed";
import styles from "@/components/Styles";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-root-toast";
import { useState } from "react";
import { useAuth } from "@/context/Auth";

type SendEmailParams = {
  customer_id: string;
  description: string;
  priority: string;
  steps: string;
  msg: string;
};

// Ensure useAuth() is properly typed
type AuthContextType = {
  userID: string | null;
};

export default function ModalScreen() {
  const [priority, setPriority] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [steps, setSteps] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [btnLoading, setBtnLoading] = useState<Boolean>(false);
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
    description,
    priority,
    steps,
    msg,
  }: SendEmailParams): Promise<void> => {
    try {
      const url = `https://ctecg.co.za/ctecg_api/ticketMail.php?customerid=${encodeURIComponent(
        customer_id
      )}&description=${encodeURIComponent(
        description
      )}&priority=${encodeURIComponent(priority)}&steps=${encodeURIComponent(
        steps
      )}&msg=${encodeURIComponent(msg)}`;
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
        setPriority("");
        setDescription("");
        setSteps("");
        setMessage("");
      }
    } catch (error) {
      toast("Unable to Connect.");
      setBtnLoading(false);
    }
  };

  // Ensure other variables are of type string or provide default values
  const handleSendEmail = () => {
    setBtnLoading(true);
    if (userID === null) {
      toast("Unable to Connect.");
      setBtnLoading(false);
      return;
    } else {
      sendEmail({
        customer_id: userID,
        description: description,
        priority: priority,
        steps: steps,
        msg: message,
      });
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <KeyboardAvoidingView style={[styles.innerContainer, { padding: 15 }]}>
          <ThemedText style={{ marginTop: 15 }}>Ticket Information</ThemedText>
          <ThemedText style={styles.InputTitle}>Priority</ThemedText>
          <View
            style={{
              width: "100%",
              backgroundColor: "#eee",
              borderRadius: 15,
            }}
          >
            <Picker
              selectedValue={priority}
              onValueChange={(itemValue, itemIndex) => setPriority(itemValue)}
            >
              <Picker.Item label="Low" value="Low" />
              <Picker.Item label="Normal" value="Normal" />
              <Picker.Item label="High" value="High" />
            </Picker>
          </View>

          <View style={{ width: "100%" }}>
            <View style={styles.InputTitle}>
              <ThemedText>Description</ThemedText>
            </View>
            <TextInput
              placeholder="Enter ticket description"
              value={description}
              onChangeText={(text) => setDescription(text)}
              multiline={true}
              numberOfLines={4}
              style={[{ textAlignVertical: "top" }, styles.Input]}
            />
          </View>

          <View style={{ width: "100%" }}>
            <View style={styles.InputTitle}>
              <ThemedText>Steps</ThemedText>
            </View>
            <TextInput
              placeholder="Enter steps taken"
              value={steps}
              onChangeText={(text) => setSteps(text)}
              multiline={true}
              numberOfLines={4}
              style={[{ textAlignVertical: "top" }, styles.Input]}
            />
          </View>

          <View style={{ width: "100%" }}>
            <View style={styles.InputTitle}>
              <ThemedText>Error Message</ThemedText>
            </View>
            <TextInput
              placeholder="Enter error message if available"
              value={message}
              onChangeText={(text) => setMessage(text)}
              multiline={true}
              numberOfLines={4}
              style={[{ textAlignVertical: "top" }, styles.Input]}
            />
          </View>

          {btnLoading ? (
            <Pressable disabled style={[styles.btn, { marginTop: 25 }]}>
              <ThemedText style={{ color: "#fff" }}>Please Wait...</ThemedText>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => handleSendEmail()}
              style={[styles.btn, { marginTop: 25 }]}
            >
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
