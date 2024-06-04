import { FlatList, useColorScheme } from "react-native";
import React from "react";
import { Text as ThemedText, View as ThemedView } from "@/components/Themed";
import { useLocalSearchParams } from "expo-router";
import InvoiceItem from "@/components/invoiceItem";
import { Ionicons } from "@expo/vector-icons";

interface Invoice {
  id: string;
  amount: string;
  invoicedate: string;
  paymentstatus: string;
}

const InvoiceList = () => {
  let colorScheme = useColorScheme();
  let iconColor = colorScheme === "dark" ? "white" : "black";
  const { invoices } = useLocalSearchParams();

  let parsedInvoices: any[] = [];

  if (invoices && typeof invoices === "string") {
    try {
      parsedInvoices = JSON.parse(invoices);
    } catch (error) {
      console.error("Failed to parse invoices:", error);
    }
  } else {
    console.error("Invoices parameter is missing or not a string");
  }

  return (
    <ThemedView style={{ paddingVertical: 15 }}>
      {!parsedInvoices ? (
        <ThemedView
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Ionicons name="documents-outline" size={140} color={iconColor} />
          <ThemedText style={{ fontWeight: "200", fontSize: 24 }}>
            No Records Found
          </ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          style={{ width: "100%", paddingHorizontal: 15 }}
          data={parsedInvoices}
          keyExtractor={(invoice) => invoice.id}
          renderItem={({ item: invoice }) => (
            <InvoiceItem
              amount={"R" + invoice.amount}
              invDate={invoice.invoicedate}
              paymentstatus={invoice.paymentstatus}
              invid={invoice.id}
            />
          )}
        />
      )}
    </ThemedView>
  );
};

export default InvoiceList;
