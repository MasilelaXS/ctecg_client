import { useRouter, useSegments } from "expo-router";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  PropsWithChildren,
} from "react";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";

// Define the AuthContext with the expected shape of the context value
interface AuthContextType {
  userID: string | null;
  signIn: (id: string) => void;
  signOut: () => void;
  showMenu: () => void;
  hideMenu: () => void;
  menuStatus: boolean;
  connection: boolean;
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
  const prevRootSegmentRef = useRef<string | null>(null);
  const [menu, SetShowMenu] = useState<boolean>(false);

  const segments = useSegments();
  const rootSegment = segments[0];
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
    // console.log("useEffect triggered");
    // console.log("userID:", userID);
    // console.log("rootSegment:", rootSegment);
    // console.log("prevRootSegment:", prevRootSegmentRef.current);
    // console.log("isConnected:", isConnected);

    // If rootSegment or userID are still undefined, do nothing
    if (rootSegment === undefined) return;

    // Prevent unnecessary redirects
    if (prevRootSegmentRef.current === rootSegment) return;

    prevRootSegmentRef.current = rootSegment;

    if (!isConnected) {
      // Redirect to error page if no internet
      router.replace("/error"); // Assuming you have an /error route
      return;
    }

    if (!userID && rootSegment !== "(auth)") {
      router.replace("/(auth)/login");
    } else if (userID && rootSegment !== "(app)") {
      router.replace("/(app)");
    }
  }, [userID, rootSegment, isConnected]);

  // Corrected signIn method
  const signIn = (id: string) => {
    setUserID(id);
    router.replace("/(app)");
  };

  return (
    <AuthContext.Provider
      value={{
        userID,
        signIn,
        signOut: () => {
          setUserID(null);
          router.replace("/(auth)/login");
        },
        hideMenu: () => SetShowMenu(false),
        showMenu: () => SetShowMenu(true),
        menuStatus: menu,
        connection: isConnected,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
