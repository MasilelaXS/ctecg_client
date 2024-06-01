import { StatusBar } from "expo-status-bar";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Image,
  View,
  Pressable,
  Text,
} from "react-native";
import { Text as ThemedText, View as ThemedView } from "@/components/Themed";
import styles from "@/components/Styles";
import Button from "@/components/Button";
import { useState } from "react";

export default function ModalScreen() {
  const Ad = "https://ctecg.co.za/ctecg_api/Ads/ad.png";

  const [name, setName] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [town, setTown] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [info, setInfo] = useState<string>("");

  const handleNameChange = (text: string) => {
    setName(text);
  };

  const handleContactChange = (text: string) => {
    setContact(text);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
  };

  const handleAddressChange = (text: string) => {
    setAddress(text);
  };

  const handleTownChange = (text: string) => {
    setTown(text);
  };

  const handleCodeChange = (text: string) => {
    setCode(text);
  };

  const handleInfoChange = (text: string) => {
    setInfo(text);
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
              onChangeText={handleNameChange}
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
              onChangeText={handleContactChange}
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
              onChangeText={handleEmailChange}
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
              onChangeText={handleAddressChange}
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
              onChangeText={handleTownChange}
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
              onChangeText={handleCodeChange}
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
              onChangeText={handleInfoChange}
            />
          </View>

          <ThemedText style={{ marginTop: 15 }}>
            It is important to note that the complimentary one-month internet
            service will be provided upon the successful finalization of the
            contract.
          </ThemedText>

          <Button linkUrl="" btnText="Submit" btnBorder={false} />
        </KeyboardAvoidingView>
      </ScrollView>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </ThemedView>
  );
}
