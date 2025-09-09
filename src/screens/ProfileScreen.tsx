import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import CustomButton from '../components/CustomButton';
import { Colors, Typography, CommonStyles, Spacing } from '../constants/Design';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Profile" subtitle="Manage your account" variant="primary" />
      <View style={styles.content}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>
        
        <CustomButton
          title="Sign Out"
          onPress={handleLogout}
          variant="outline"
          size="large"
          style={styles.logoutButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...CommonStyles.safeArea,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  userInfo: {
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  userName: {
    fontSize: Typography.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    fontSize: Typography.md,
    color: Colors.textSecondary,
  },
  logoutButton: {
    marginTop: Spacing.xl,
  },
});
