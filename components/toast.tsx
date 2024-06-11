// toast.tsx
import React from 'react';
import { useColorScheme } from 'react-native';
import Toast from "react-native-root-toast";

const useToast = () => {
  const colorScheme = useColorScheme();

  const showToast = (toastMessage: string, toastDuration: boolean) => {
    const toastColor = colorScheme === "dark" ? "#fff" : "#18181B";
    const toastText = colorScheme === "dark" ? "black" : "white";

    Toast.show(toastMessage, {
      duration: toastDuration ? Toast.durations.LONG : Toast.durations.SHORT,
      animation: true,
      hideOnPress: true,
      backgroundColor: toastColor,
      textColor: toastText,
      opacity: 0.8
    });
  };

  return showToast;
};

export default useToast;
