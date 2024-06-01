import React, { FC } from "react";
import { View, useColorScheme } from "react-native";
import styles from "@/components/Styles";
import { Text as ThemedText, View as ThemedView } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import Button from "./Button";

interface ItemProps {
  invDate: string;
  paymentstatus: string;
  amount: string;
  invid: string;
}
const InvoiceItem: FC<ItemProps> = ({
  invDate,
  paymentstatus,
  amount,
  invid,
}) => {
  let colorScheme = useColorScheme();
  let iconColor = colorScheme === "dark" ? "white" : "black";
  return (
    <View style={styles.flexRow}>
      <View>
        <ThemedText style={{ fontWeight: "bold" }}>{invDate}</ThemedText>
        <ThemedText style={{ fontSize: 25, fontWeight: "200" }}>
          {amount}
        </ThemedText>
        <ThemedText style={{ fontStyle: "italic" }}>{paymentstatus}</ThemedText>
      </View>
      <View>
        <Button
          linkUrl={"/invoice/" + invid}
          btnText="Download"
          btnBorder={false}
        />
      </View>
      {/* <ThemedView
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        /> */}
    </View>
  );
};

export default InvoiceItem;
