import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

import CustomButton from '../components/CustomButton';
import LoadingSpinner from '../components/LoadingSpinner';
import { Colors, Typography, Spacing, BorderRadius, CommonStyles } from '../constants/Design';

interface CheckUserData {
  user_exists: boolean;
  needs_registration: boolean;
  invoicingid: string;
  customer_data: {
    name: string;
    email: string;
  };
}

export default function LoginScreen() {
  const [invoicingId, setInvoicingId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'check-user' | 'login' | 'register'>('check-user');
  const [userData, setUserData] = useState<CheckUserData | null>(null);
  const { login } = useAuth();

  const handleContactSupport = async () => {
    const whatsappUrl = 'https://wa.me/27769790642';
    try {
      await Linking.openURL(whatsappUrl);
    } catch (error) {
      Alert.alert('Error', 'Could not open WhatsApp. Please contact support at +27 76 979 0642');
    }
  };

  const handleCheckUser = async () => {
    if (!invoicingId.trim()) {
      Alert.alert('Error', 'Please enter your invoicing ID');
      return;
    }

    console.log('🔍 Checking user with ID:', invoicingId.trim());
    setIsLoading(true);
    
    try {
      // Clear any previous user data to avoid interference
      setUserData(null);
      
      const response = await apiService.checkUser(invoicingId.trim());
      console.log('✅ CheckUser response:', response);
      
      
      if (response.success && response.data) {
        setUserData(response.data);
        
        if (response.data.user_exists) {
          setStep('login');
        } else {
          setStep('register');
        }
      }
    } catch (error: any) {
      Alert.alert('Customer Not Found', error.message || 'Please check your invoicing ID and try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    setIsLoading(true);
    try {
      await login(invoicingId.trim(), password);
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Please check your password and try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!password.trim()) {
      Alert.alert('Error', 'Please create a password');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.register({
        invoicingid: invoicingId.trim(),
        password: password,
      });

      if (response.success && response.data) {
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => login(invoicingId.trim(), password) }
        ]);
      }
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep('check-user');
    setPassword('');
    setUserData(null);
  };

  const getStepTitle = () => {
    switch (step) {
      case 'check-user':
        return 'Welcome to My CTECG';
      case 'login':
        return `Welcome back!`;
      case 'register':
        return `Let's get you set up`;
      default:
        return 'My CTECG';
    }
  };

  const getStepSubtitle = () => {
    switch (step) {
      case 'check-user':
        return 'Enter your CTECG invoicing ID to continue';
      case 'login':
        return `Hi ${userData?.customer_data?.name || 'Customer'}, enter your password to sign in`;
      case 'register':
        return `Hi ${userData?.customer_data?.name || 'Customer'}, create a password to secure your account`;
      default:
        return '';
    }
  };

  const renderStepButtons = () => {
    switch (step) {
      case 'check-user':
        return (
          <CustomButton
            title="Continue"
            onPress={handleCheckUser}
            variant="primary"
            size="large"
            style={styles.primaryButton}
          />
        );
      case 'login':
        return (
          <View>
            <CustomButton
              title="Sign In"
              onPress={handleLogin}
              variant="primary"
              size="large"
              style={styles.primaryButton}
            />
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>Wrong Customer ID?</Text>
            </TouchableOpacity>
          </View>
        );
      case 'register':
        return (
          <View>
            <CustomButton
              title="Create Account"
              onPress={handleRegister}
              variant="primary"
              size="large"
              style={styles.primaryButton}
            />
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>Wrong Customer ID?</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Please wait..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../../assets/icon.png')} 
                style={styles.logoImage}
                resizeMode="contain"
              />
              <Text style={styles.logoText}>My CTECG</Text>
              <Text style={styles.tagline}>Your Connection, Your Control</Text>
            </View>
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            <Text style={styles.welcomeText}>{getStepTitle()}</Text>
            <Text style={styles.subtitleText}>
              {getStepSubtitle()}
            </Text>

            {/* Customer ID Display (for login/register steps) */}
            {(step === 'login' || step === 'register') && userData && (
              <View style={styles.customerInfoCard}>
                <View style={styles.customerInfoHeader}>
                  <Text style={styles.customerInfoLabel}>Customer ID</Text>
                  <TouchableOpacity onPress={handleBack}>
                    <Ionicons name="pencil" size={16} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.customerInfoValue}>{userData.invoicingid}</Text>
                <Text style={styles.customerName}>{userData.customer_data.name}</Text>
              </View>
            )}

            {/* Invoicing ID Input (check-user step) */}
            {step === 'check-user' && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Customer Invoicing ID</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="card-outline"
                    size={20}
                    color={Colors.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.textInput}
                    value={invoicingId}
                    onChangeText={setInvoicingId}
                    placeholder="Enter your invoicing ID"
                    placeholderTextColor={Colors.textMuted}
                    autoCapitalize="characters"
                    autoCorrect={false}
                  />
                </View>
              </View>
            )}

            {/* Password Input (login/register steps) */}
            {(step === 'login' || step === 'register') && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  {step === 'register' ? 'Create Password' : 'Password'}
                </Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={Colors.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.textInput, styles.passwordInput]}
                    value={password}
                    onChangeText={setPassword}
                    placeholder={step === 'register' ? 'Create a strong password' : 'Enter your password'}
                    placeholderTextColor={Colors.textMuted}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.passwordToggle}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={Colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
                {step === 'register' && (
                  <Text style={styles.passwordHint}>
                    Password must be at least 8 characters long
                  </Text>
                )}
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              {renderStepButtons()}
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerTextContainer}>
              <Text style={styles.footerText}>Need help? </Text>
              <TouchableOpacity onPress={handleContactSupport} style={styles.supportLink}>
                <Text style={styles.footerLinkText}>Contact Support</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.createdByText}>
              created with ❤︎ by Dannel Web Design
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...CommonStyles.safeArea,
    backgroundColor: Colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.md,
  },
  header: {
    alignItems: 'center',
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  logoImage: {
    width: 80,
    height: 80,
    marginBottom: Spacing.md,
  },
  logoText: {
    fontSize: Typography.xxxl,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    letterSpacing: Typography.letterSpacing.wide,
    marginBottom: Spacing.xs,
  },
  tagline: {
    fontSize: Typography.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.textSecondary,
    letterSpacing: Typography.letterSpacing.wider,
    textTransform: 'uppercase',
  },
  formContainer: {
    flex: 1,
    paddingBottom: Spacing.lg,
  },
  welcomeText: {
    ...CommonStyles.h2,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitleText: {
    ...CommonStyles.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: Typography.lg * Typography.lineHeights.relaxed,
  },
  customerInfoCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  customerInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  customerInfoLabel: {
    fontSize: Typography.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: Typography.letterSpacing.wider,
  },
  customerInfoValue: {
    fontSize: Typography.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  customerName: {
    fontSize: Typography.md,
    color: Colors.text,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
    letterSpacing: Typography.letterSpacing.wide,
    textTransform: 'uppercase',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    minHeight: 52,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  textInput: {
    flex: 1,
    fontSize: Typography.md,
    fontWeight: Typography.weights.regular,
    color: Colors.text,
    paddingVertical: Spacing.sm,
  },
  passwordInput: {
    paddingRight: Spacing.sm,
  },
  passwordToggle: {
    padding: Spacing.xs,
  },
  passwordHint: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  buttonContainer: {
    marginTop: Spacing.sm,
  },
  primaryButton: {
    marginBottom: Spacing.sm,
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  backButtonText: {
    fontSize: Typography.sm,
    color: Colors.primary,
    fontWeight: Typography.weights.medium,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  footerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  footerLinkText: {
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
  },
  supportLink: {
    // No additional styles needed for TouchableOpacity in this context
  },
  createdByText: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.sm,
    fontStyle: 'italic',
  },
});
