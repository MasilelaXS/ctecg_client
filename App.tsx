import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { View, Text, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/screens/LoginScreen';
import LoadingSpinner from './src/components/LoadingSpinner';
import { Colors, Typography, Spacing } from './src/constants/Design';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Custom Splash Screen Component
function CustomSplashScreen() {
  return (
    <SafeAreaView style={splashStyles.container}>
      <View style={splashStyles.content}>
        <Image 
          source={require('./assets/splash.png')} 
          style={splashStyles.logo}
          resizeMode="contain"
        />
        <Text style={splashStyles.title}>My CTECG</Text>
        <Text style={splashStyles.subtitle}>Your Connection, Your Control</Text>
      </View>
      <View style={splashStyles.footer}>
        <Text style={splashStyles.footerText}>
          created with ❤︎ by Dannel Web Design
        </Text>
      </View>
    </SafeAreaView>
  );
}

function AppContent() {
  const { user, isLoading } = useAuth();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync({
          ...Ionicons.font,
        });

        // Give it a small delay to ensure everything is loaded
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn('Error loading fonts:', e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!appIsReady || isLoading) {
    return <CustomSplashScreen />;
  }

  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <LoginScreen />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
        <StatusBar style="dark" backgroundColor="#ffffff" />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.xxxl,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  footer: {
    paddingBottom: Spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
