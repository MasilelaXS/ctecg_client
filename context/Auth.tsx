import { useRouter, useSegments } from "expo-router";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
} from "react";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";

// Define the AuthContext with the expected shape of the context value
interface AuthContextType {
  userID: string | null;
  signIn: (id: string) => void;
  signOut: () => void;
}

// Initialize the AuthContext
const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: PropsWithChildren<{}>) {
  const [userID, setUserID] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(true);

  const rootSegment = useSegments()[0];
  const router = useRouter();

  // Subscribe to network state updates
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      if (state.isConnected !== null && state.isConnected !== undefined) {
        setIsConnected(state.isConnected);
      }
    });

    // Clean up the subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  // Handle user ID and network state changes
  useEffect(() => {
    if (userID === undefined) return;

    if (!isConnected) {
      // Redirect to error page if no internet
      router.replace("/error"); // Assuming you have an /error route
      return;
    }

    if (!userID && rootSegment !== "(auth)") {
      router.replace("/(auth)/login");
      console.log(rootSegment);
    } else if (userID && rootSegment !== "(app)") {
      router.replace("/(app)");
      console.log(rootSegment);
    }
  }, [userID, rootSegment, isConnected]);

  // Corrected signIn method
  const signIn = (id: string) => {
    setUserID(id);
    router.replace("/(app)");
    console.log(userID); // Log the new ID directly
  };

  // Log the updated userID state
  useEffect(() => {
    if (userID) {
      console.log(userID);
    }
  }, [userID]);

  return (
    <AuthContext.Provider
      value={{
        userID,
        signIn,
        signOut: () => {
          setUserID(null);
          router.replace("/(auth)");
          console.log("sign Out:" + userID);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
