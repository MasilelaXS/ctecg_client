import React, { useEffect, useState } from "react";
import {
  Image,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text as ThemedText, View as ThemedView } from "@/components/Themed";
import styles from "@/components/Styles";
import Button from "@/components/Button";
import Logo from "../../assets/images/client.png";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/Auth";
import useToast from "@/components/toast";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
  const [data, setData] = useState<any>(null);
  const [code, setCode] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const toast = useToast();
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  const { signIn, connection } = useAuth();

  useEffect(() => {
    const getUname = async () => {
      const storedName = await AsyncStorage.getItem("username");
      setUsername(storedName);
    };

    getUname();
  }, []);

  // Mock fetchData function for demonstration
  const handleSignIn = async (id: string) => {
    if (!connection) {
      router.replace("./error");
    } else {
      setBtnLoading(true);
      try {
        // Login Here because if login from Button then data doesn't come through. Yu need t press login again because the function is async
        if (!id) {
          toast("Please Enter Login Info.", false);
          setBtnLoading(false);
        } else {
          // Fetching Login Details
          const response = await fetch(
            "https://ctecg.co.za/ctecg_api/getCustomerData.php?customerid=" + id //2021
          );
          setBtnLoading(false);
          const jsonData = await response.json();

          if (jsonData !== null && jsonData.customer_details.error == "") {
            if (code.toUpperCase() == jsonData.customer_details.invoicingid) {
              if (
                username == null ||
                username !== jsonData.customer_details.name
              ) {
                await AsyncStorage.setItem(
                  "username",
                  jsonData.customer_details.name
                );
              }
              signIn(id);
            } else {
              toast("Incorrect Login Info.", false);
              setCode("");
              setId("");
            }
          } else {
            toast("Unable to Connect.", false);
          }
        }
      } catch (error) {
        toast(
          "Please Make Sure You Have Internet Access and Try Again.",
          false
        );
        setBtnLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{
            flex: 1,
            padding: 15,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={Logo}
            style={{
              width: 150,
              height: 100,
              marginLeft: 15,
            }}
            resizeMode="contain"
            resizeMethod="scale"
          />
          {username !== null ? (
            <ThemedText
              style={{
                fontWeight: "200",
                fontSize: 25,
                marginTop: 45,
                width: "100%",
              }}
            >
              Hi {username}, Welcome Back.
            </ThemedText>
          ) : (
            <ThemedText
              style={{
                fontWeight: "200",
                fontSize: 25,
                marginTop: 45,
                width: "100%",
              }}
            >
              Let's Login
            </ThemedText>
          )}

          <View
            style={[
              styles.Input,
              {
                marginVertical: 15,
                flexDirection: "row",
                alignItems: "center",
                overflow: "hidden",
              },
            ]}
          >
            <Ionicons name="finger-print-outline" size={20} />
            <TextInput
              placeholder="Enter Client ID"
              value={id}
              onChangeText={(text) => setId(text)}
              autoCapitalize="none"
              keyboardType="phone-pad"
              style={{
                paddingHorizontal: 15,
                flex: 1,
              }}
            />
            {/* <Pressable
              style={{
                paddingHorizontal: 15,
                paddingVertical: 5,
              }}
            >
              <ThemedText style={{ fontWeight: "bold", color: "#cc0000" }}>
                Verify
              </ThemedText>
            </Pressable> */}
          </View>

          <View
            style={[
              styles.Input,
              {
                marginVertical: 15,
                flexDirection: "row",
                alignItems: "center",
                overflow: "hidden",
              },
            ]}
          >
            <Ionicons name="key-outline" size={20} />
            <TextInput
              placeholder="Enter Client Code"
              value={code}
              onChangeText={(text) => setCode(text)}
              style={{
                paddingHorizontal: 15,
                flex: 1,
              }}
            />
          </View>

          {btnLoading ? (
            <Pressable
              style={{
                width: "100%",
                backgroundColor: "#cc0000",
                padding: 16,
                marginVertical: 15,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
              }}
            >
              <Text style={{ color: "#fff" }}>Please Wait...</Text>
            </Pressable>
          ) : (
            <Pressable
              style={{
                width: "100%",
                backgroundColor: "#cc0000",
                padding: 16,
                marginVertical: 15,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
              }}
              onPress={() => handleSignIn(id)}
            >
              <Text style={{ color: "#fff" }}>Sign In</Text>
            </Pressable>
          )}

          <Button
            linkUrl="https://wa.me//27769790642"
            btnText="Don't Have Required Information"
            btnBorder={true}
          />
        </KeyboardAvoidingView>
        <ThemedText
          lightColor="#ccc"
          darkColor="#333"
          style={{
            marginVertical: 30,
            width: "100%",
            textAlignVertical: "center",
            textAlign: "center",
          }}
        >
          Powered by Dannel Web Design
        </ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
};

export default Login;
