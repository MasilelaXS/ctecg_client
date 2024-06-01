import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, Tabs } from "expo-router";
import { Pressable, Image } from "react-native";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import Logo from "@/assets/images/client.png";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <Ionicons size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarShowLabel: false,
        headerTitleAlign: "center",
        headerLeft: () => (
          <Image
            source={Logo}
            style={{
              width: 70,
              height: "80%",
              marginLeft: 15,
            }}
            resizeMode="contain"
            resizeMethod="scale"
          />
        ),
        headerRight: () => (
          <Link href="/modal" asChild>
            <Pressable>
              {({ pressed }) => (
                <Ionicons
                  name="person-add-outline"
                  size={25}
                  color={Colors[colorScheme ?? "light"].text}
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          </Link>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <TabBarIcon name="home" color={color} />
            ) : (
              <TabBarIcon name="home-outline" color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="status"
        options={{
          title: "Usage Info",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <TabBarIcon name="swap-vertical" color={color} />
            ) : (
              <TabBarIcon name="swap-vertical-outline" color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="bill"
        options={{
          title: "Statement",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <TabBarIcon name="stats-chart" color={color} />
            ) : (
              <TabBarIcon name="stats-chart-outline" color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <TabBarIcon name="person-circle" color={color} />
            ) : (
              <TabBarIcon name="person-circle-outline" color={color} />
            ),
        }}
      />
    </Tabs>
  );
}
