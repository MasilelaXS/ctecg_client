import { FC } from "react";
import { Link } from "expo-router";
import { Text, View } from "@/components/Themed";
import { Pressable, StyleSheet } from "react-native";

interface ButtonProps {
  linkUrl: string;
  btnText: string;
  btnBorder: boolean;
}

const Button: FC<ButtonProps> = ({ linkUrl, btnText, btnBorder }) => {
  return (
    <Link href={linkUrl} asChild>
      <Pressable style={btnBorder ? styles.btnBorder : styles.btn}>
        <Text style={!btnBorder ? { color: "#fff" } : null}>{btnText}</Text>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  btn: {
    width: "100%",
    backgroundColor: "#cc0000",
    padding: 16,
    marginVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },

  btnBorder: {
    width: "100%",
    backgroundColor: "rgba(204,0,0,.2)",
    padding: 16,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#cc0000",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 10,
  },
});

export default Button;
