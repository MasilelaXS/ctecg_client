import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal,
  Pressable,
  Dimensions
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { Colors, Typography, Spacing } from '../constants/Design';

interface TopNavigationProps {
  title: string;
  subtitle?: string;
}

export default function TopNavigation({ title, subtitle }: TopNavigationProps) {
  const { user, logout } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    setShowProfileDropdown(false);
    logout();
  };

  const handleProfilePress = () => {
    setShowProfileDropdown(false);
    // Navigate to profile screen if needed
  };

  return (
    <>
      <SafeAreaView edges={['top']} style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => setShowProfileDropdown(true)}
          >
            <View style={styles.profileIcon}>
              <Text style={styles.profileInitial}>
                {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Profile Dropdown Modal */}
      <Modal
        visible={showProfileDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowProfileDropdown(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowProfileDropdown(false)}
        >
          <View style={[styles.dropdown, { marginTop: insets.top + 60 }]}>
            <View style={styles.userInfo}>
              <View style={styles.profileIconLarge}>
                <Text style={styles.profileInitialLarge}>
                  {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </Text>
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>
                  {user?.firstName} {user?.lastName}
                </Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.dropdownItem}
              onPress={handleProfilePress}
            >
              <Ionicons name="person-outline" size={20} color={Colors.text} />
              <Text style={styles.dropdownItemText}>Profile Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.dropdownItem}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={20} color={Colors.error} />
              <Text style={[styles.dropdownItemText, { color: Colors.error }]}>
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 60,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: Typography.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  subtitle: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.surface,
  },
  profileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: Typography.md,
    fontWeight: Typography.weights.bold,
    color: 'white',
    textTransform: 'uppercase',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingRight: Spacing.md,
  },
  dropdown: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: Spacing.md,
    minWidth: 250,
    maxWidth: Dimensions.get('window').width - 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingBottom: Spacing.md,
  },
  profileIconLarge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitialLarge: {
    fontSize: Typography.lg,
    fontWeight: Typography.weights.bold,
    color: 'white',
    textTransform: 'uppercase',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: Typography.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
  },
  userEmail: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    borderRadius: 8,
  },
  dropdownItemText: {
    fontSize: Typography.md,
    color: Colors.text,
    flex: 1,
  },
});
