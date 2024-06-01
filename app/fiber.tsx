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

export default function ModalScreen() {
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
            />
          </View>

          <Pressable>
            <ThemedText style={{ marginTop: 15 }}></ThemedText>
          </Pressable>

          <Button linkUrl="" btnText="Submit" btnBorder={false} />
        </KeyboardAvoidingView>
      </ScrollView>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </ThemedView>
  );
}
