import { StatusBar } from "expo-status-bar";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { Text as ThemedText, View as ThemedView } from "@/components/Themed";
import styles from "@/components/Styles";
import Button from "@/components/Button";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";

export default function ModalScreen() {
  const [priority, setPriority] = useState<string | undefined>(undefined);
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
              multiline={true}
              numberOfLines={4}
              style={[{ textAlignVertical: "top" }, styles.Input]}
            />
          </View>

          <Button linkUrl="" btnText="Submit" btnBorder={false} />
        </KeyboardAvoidingView>
      </ScrollView>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </ThemedView>
  );
}
