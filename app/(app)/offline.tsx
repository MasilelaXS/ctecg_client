import { StatusBar } from "expo-status-bar";
import { Platform, ScrollView, View, useColorScheme } from "react-native";
import { Text as ThemedText, View as ThemedView } from "@/components/Themed";
import styles from "@/components/Styles";
import Button from "@/components/Button";
import { Ionicons } from "@expo/vector-icons";

const Offline = () => {
  let colorScheme = useColorScheme();
  let iconColor = colorScheme === "dark" ? "white" : "black";
  
  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <View style={[styles.innerContainer, { padding: 15 }]}>
          <ThemedText
            style={{
              marginTop: 15,
              fontSize: 25,
              fontWeight: "200",
              textAlign: "left",
              width: "100%",
            }}
          >
            Internet Connection Troubleshooting Guide
          </ThemedText>

          <ThemedText>
            If you are experiencing issues with your internet connection, please
            follow the steps below to troubleshoot before opening a support
            ticket:
          </ThemedText>

          <ThemedText
            style={{
              marginVertical: 15,
              fontWeight: "bold",
              textAlign: "left",
              width: "100%",
            }}
          >
            1. Check the Power Supply:
          </ThemedText>

          <View style={{ flexDirection: "row", width: "100%" }}>
            <Ionicons name="radio-button-on-outline" color={iconColor} />
            <ThemedText style={{ marginLeft: 15 }}>
              Ensure that all devices are properly plugged in and have power.
            </ThemedText>
          </View>

          <View style={{ flexDirection: "row", width: "100%" }}>
            <Ionicons name="radio-button-on-outline" color={iconColor} />
            <ThemedText style={{ marginLeft: 15 }}>
              Check for any loose cables or connections.
            </ThemedText>
          </View>

          <ThemedText
            style={{
              marginVertical: 15,
              fontWeight: "bold",
              textAlign: "left",
              width: "100%",
            }}
          >
            2. Check the Power Supply:
          </ThemedText>

          <View style={{ flexDirection: "row", width: "100%" }}>
            <Ionicons name="radio-button-on-outline" color={iconColor} />
            <ThemedText style={{ marginLeft: 15 }}>
              Unplug the router from the power outlet.
            </ThemedText>
          </View>

          <View style={{ flexDirection: "row", width: "100%" }}>
            <Ionicons name="radio-button-on-outline" color={iconColor} />
            <ThemedText style={{ marginLeft: 15 }}>
              Wait for 30 seconds.
            </ThemedText>
          </View>

          <View style={{ flexDirection: "row", width: "100%" }}>
            <Ionicons name="radio-button-on-outline" color={iconColor} />
            <ThemedText style={{ marginLeft: 15 }}>
              Plug the router back into the power outlet.
            </ThemedText>
          </View>

          <View style={{ flexDirection: "row", width: "100%" }}>
            <Ionicons name="radio-button-on-outline" color={iconColor} />
            <ThemedText style={{ marginLeft: 15 }}>
              Wait for the router to fully restart (this may take a few
              minutes).
            </ThemedText>
          </View>

          <ThemedText
            style={{
              marginVertical: 15,
              fontWeight: "bold",
              textAlign: "left",
              width: "100%",
            }}
          >
            3. Verify PoE Connection:
          </ThemedText>

          <View style={{ flexDirection: "row", width: "100%" }}>
            <Ionicons name="radio-button-on-outline" color={iconColor} />
            <ThemedText style={{ marginLeft: 15 }}>
              Ensure that the PoE injector is properly connected and powered on.
            </ThemedText>
          </View>

          <View style={{ flexDirection: "row", width: "100%" }}>
            <Ionicons name="radio-button-on-outline" color={iconColor} />
            <ThemedText style={{ marginLeft: 15 }}>
              Check that the Ethernet cable from the PoE injector to your device
              (e.g., a camera or access point) is securely connected.
            </ThemedText>
          </View>

          <ThemedText
            style={{
              marginVertical: 15,
              fontWeight: "bold",
              textAlign: "left",
              width: "100%",
            }}
          >
            4. Check the Extender (if applicable):
          </ThemedText>

          <View style={{ flexDirection: "row", width: "100%" }}>
            <Ionicons name="radio-button-on-outline" color={iconColor} />
            <ThemedText style={{ marginLeft: 15 }}>
              Ensure the extender is powered on and properly connected.
            </ThemedText>
          </View>

          <View style={{ flexDirection: "row", width: "100%" }}>
            <Ionicons name="radio-button-on-outline" color={iconColor} />
            <ThemedText style={{ marginLeft: 15 }}>
              Check if the extender is receiving a good signal from the router.
            </ThemedText>
          </View>

          <View style={{ flexDirection: "row", width: "100%" }}>
            <Ionicons name="radio-button-on-outline" color={iconColor} />
            <ThemedText style={{ marginLeft: 15 }}>
              Move the extender closer to the router if necessary.
            </ThemedText>
          </View>

          <ThemedText
            style={{
              marginVertical: 15,
              fontWeight: "bold",
              textAlign: "left",
              width: "100%",
            }}
          >
            5. Inspect the Switch (if applicable):
          </ThemedText>

          <View style={{ flexDirection: "row", width: "100%" }}>
            <Ionicons name="radio-button-on-outline" color={iconColor} />
            <ThemedText style={{ marginLeft: 15 }}>
              Ensure the switch is powered on.
            </ThemedText>
          </View>

          <View style={{ flexDirection: "row", width: "100%" }}>
            <Ionicons name="radio-button-on-outline" color={iconColor} />
            <ThemedText style={{ marginLeft: 15 }}>
              Check that all Ethernet cables connected to the switch are secure.
            </ThemedText>
          </View>

          <View style={{ flexDirection: "row", width: "100%" }}>
            <Ionicons name="radio-button-on-outline" color={iconColor} />
            <ThemedText style={{ marginLeft: 15 }}>
              Verify that the switch’s indicator lights show active connections.
            </ThemedText>
          </View>

          <ThemedText
            style={{
              marginVertical: 15,
              fontWeight: "bold",
              textAlign: "left",
              width: "100%",
            }}
          >
            6. Check the MikroTik Router (if applicable):
          </ThemedText>

          <View style={{ flexDirection: "row", width: "100%" }}>
            <Ionicons name="radio-button-on-outline" color={iconColor} />
            <ThemedText style={{ marginLeft: 15 }}>
              Ensure the MikroTik router is powered on.
            </ThemedText>
          </View>

          <View style={{ flexDirection: "row", width: "100%" }}>
            <Ionicons name="radio-button-on-outline" color={iconColor} />
            <ThemedText style={{ marginLeft: 15 }}>
              Check the Ethernet cable connections to the MikroTik router.
            </ThemedText>
          </View>

          <View style={{ flexDirection: "row", width: "100%" }}>
            <Ionicons name="radio-button-on-outline" color={iconColor} />
            <ThemedText style={{ marginLeft: 15 }}>
              If possible, log in to the MikroTik router's web interface to
              verify its status and settings.
            </ThemedText>
          </View>

          <ThemedText
            style={{
              marginVertical: 15,
              fontWeight: "bold",
              textAlign: "left",
              width: "100%",
            }}
          >
            7. Test Your Internet Connection:
          </ThemedText>

          <View style={{ flexDirection: "row", width: "100%" }}>
            <Ionicons name="radio-button-on-outline" color={iconColor} />
            <ThemedText style={{ marginLeft: 15 }}>
              Connect a device directly to the router with an Ethernet cable to
              rule out wireless issues.
            </ThemedText>
          </View>

          <View style={{ flexDirection: "row", width: "100%" }}>
            <Ionicons name="radio-button-on-outline" color={iconColor} />
            <ThemedText style={{ marginLeft: 15 }}>
              Try accessing different websites to ensure it's not a specific
              site issue.
            </ThemedText>
          </View>

          <View style={{ flexDirection: "row", width: "100%" }}>
            <Ionicons name="radio-button-on-outline" color={iconColor} />
            <ThemedText style={{ marginLeft: 15 }}>
              If using Wi-Fi, ensure you are within range and connected to the
              correct network.
            </ThemedText>
          </View>

          <ThemedText
            style={{
              marginVertical: 15,
              fontWeight: "bold",
              textAlign: "left",
              width: "100%",
            }}
          >
            8. Reset Network Settings (if applicable):
          </ThemedText>

          <View style={{ flexDirection: "row", width: "100%" }}>
            <Ionicons name="radio-button-on-outline" color={iconColor} />
            <ThemedText style={{ marginLeft: 15 }}>
              On your device, go to the network settings and reset the network
              configuration.
            </ThemedText>
          </View>

          <View style={{ flexDirection: "row", width: "100%" }}>
            <Ionicons name="radio-button-on-outline" color={iconColor} />
            <ThemedText style={{ marginLeft: 15 }}>
              Reconnect to your Wi-Fi network and test the connection.
            </ThemedText>
          </View>

          <ThemedText
            style={{
              marginTop: 15,
              fontSize: 25,
              fontWeight: "200",
              textAlign: "left",
              width: "100%",
            }}
          >
            Open Ticket
          </ThemedText>

          <ThemedText
            style={{
              marginVertical: 15,
              fontWeight: "bold",
              textAlign: "left",
              width: "100%",
            }}
          >
            If the issue persists, please provide the following information when
            opening a ticket:
          </ThemedText>

          <View style={{ flexDirection: "row", width: "100%" }}>
            <Ionicons name="radio-button-on-outline" color={iconColor} />
            <ThemedText style={{ marginLeft: 15 }}>
              Description of the issue.
            </ThemedText>
          </View>

          <View style={{ flexDirection: "row", width: "100%" }}>
            <Ionicons name="radio-button-on-outline" color={iconColor} />
            <ThemedText style={{ marginLeft: 15 }}>
              Steps you have already taken to troubleshoot.
            </ThemedText>
          </View>

          <View style={{ flexDirection: "row", width: "100%" }}>
            <Ionicons name="radio-button-on-outline" color={iconColor} />
            <ThemedText style={{ marginLeft: 15 }}>
              Any error messages you have encountered.
            </ThemedText>
          </View>

          <Button linkUrl="/ticket" btnText="Open Ticket" btnBorder={false} />
          <View style={{ flexDirection: "row" }}>
            <ThemedText style={{ marginLeft: 15 }}>
              24/7 Support: 076 979 0642
            </ThemedText>
          </View>
        </View>
      </ScrollView>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </ThemedView>
  );
};

export default Offline;
