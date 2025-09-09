import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import UncappedUsageCard from '../components/UncappedUsageCard';
import CustomButton from '../components/CustomButton';
import LoadingSpinner from '../components/LoadingSpinner';
import TopNavigation from '../components/TopNavigation';
import { apiService } from '../services/api';
import { DashboardData } from '../types/api';
import { Colors, Typography, Spacing, CommonStyles } from '../constants/Design';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation<NavigationProp<any>>();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      console.log('User authenticated, loading dashboard for:', user.invoicingid);
      loadDashboardData();
    } else {
      console.log('No user found, waiting for authentication');
    }
  }, [user]);

  const loadDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) setIsRefreshing(true);
      else setIsLoading(true);

      console.log('Loading dashboard data...');
      const response = await apiService.getDashboardData();
      console.log('Dashboard API response:', response);
      
      if (response.success && response.data) {
        console.log('Setting dashboard data:', response.data);
        console.log('Data type check:', typeof response.data);
        console.log('Data keys:', Object.keys(response.data));
        setDashboardData(response.data as any);  // Temporary cast to bypass TypeScript error
      } else {
        console.error('Dashboard API error:', response.message);
        Alert.alert('Error', response.message || 'Failed to load dashboard data');
      }
    } catch (error) {
      console.error('Dashboard load error:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = () => {
    loadDashboardData(true);
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', onPress: logout, style: 'destructive' },
      ]
    );
  };

  const getUsagePercentage = () => {
    // Return null during loading or if data is not available
    if (!dashboardData?.usage?.current_month || !dashboardData?.usage?.package_details) {
      console.log('No dashboard data available');
      return null;
    }
    
    const { total_gb } = dashboardData.usage.current_month;
    const packageDetails = dashboardData.usage.package_details;
    
    console.log('Usage calculation data:', {
      total_gb,
      limit_gb: packageDetails.limit_gb,
      is_uncapped: packageDetails.is_uncapped,
      subscription_limit: packageDetails.subscription_limit
    });
    
    // For uncapped plans, return null to indicate percentage cannot be calculated
    if (packageDetails.is_uncapped) {
      console.log('Plan is uncapped, returning null');
      return null;
    }
    
    // Use the actual limit if available
    const limit = packageDetails.limit_gb;
    console.log('Checking limit:', limit, 'limit > 0:', limit > 0);
    
    if (limit && limit > 0) {
      const percentage = Math.min((total_gb / limit) * 100, 100);
      console.log('Calculated percentage:', percentage, `(${total_gb} / ${limit} * 100)`);
      return percentage;
    }
    
    console.log('No valid limit found, returning null');
    // If no proper limit is available, return null
    return null;
  };

  const getUsageColor = () => {
    const percentage = getUsagePercentage();
    
    // For uncapped plans or when percentage cannot be calculated
    if (percentage === null) {
      return Colors.primary;
    }
    
    // More aggressive color thresholds for better visibility
    if (percentage >= 95) return '#DC2626'; // Bright red for critical usage
    if (percentage >= 85) return '#EA580C'; // Orange-red for high usage
    if (percentage >= 70) return '#D97706'; // Orange for moderate-high usage
    if (percentage >= 50) return '#CA8A04'; // Yellow-orange for medium usage
    if (percentage >= 25) return '#16A34A'; // Green for low usage
    return '#059669'; // Dark green for very low usage
  };

  const getUsageTextColor = () => {
    const percentage = getUsagePercentage();
    
    // For uncapped plans or when percentage cannot be calculated
    if (percentage === null) {
      return Colors.text;
    }
    
    // Use white text for better contrast on darker/stronger colors
    if (percentage >= 50) return '#FFFFFF';
    return Colors.text;
  };

  const getStatusBadgeColor = () => {
    const status = dashboardData?.customer.status?.toLowerCase();
    switch (status) {
      case 'active':
      case 'current':
        return Colors.success;
      case 'inactive':
      case 'suspended':
      case 'disconnected':
        return Colors.error;
      case 'pending':
      case 'partial':
        return Colors.warning;
      default:
        return Colors.textSecondary;
    }
  };

  // Quick Action Handlers
  const handleViewUsage = () => {
    navigation.navigate('Usage' as never);
  };

  const handlePayBill = () => {
    // For now, we'll show an alert with payment options
    Alert.alert(
      'Payment Options',
      'Choose how you would like to pay your bill:',
      [
        {
          text: 'EFT',
          onPress: () => {
            Alert.alert(
              'EFT Banking Details',
              `Bank: FNB\nAccount Name: Mzanzi Lisette Media and Printing (pty) ltd\nAccount Type: Cheque\nAccount Number: 62144198737 (COPY THIS)\nBranch Code: 260147\n\nReference: ${user?.invoicingid || 'Your account number'}`,
              [{ text: 'OK' }]
            );
          }
        },
        {
          text: 'Yoco Payment',
          onPress: () => {
            Alert.alert(
              'Yoco Payment',
              'You will be redirected to Yoco\'s secure payment portal.',
              [
                {
                  text: 'Open Yoco',
                  onPress: async () => {
                    // Open the Yoco payment link
                    const yocoUrl = 'https://pay.yoco.com/mzanzi-lisetta-media-and-printing-ptyltd-ta-ctecg';
                    try {
                      await Linking.openURL(yocoUrl);
                    } catch (error) {
                      Alert.alert('Error', 'Could not open payment link');
                    }
                  }
                },
                { text: 'Cancel', style: 'cancel' }
              ]
            );
          }
        },
        {
          text: 'Contact Support',
          onPress: handleSupport
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const handleSupport = () => {
    navigation.navigate('Support' as never);
  };

  const handleInvoices = () => {
    navigation.navigate('Billing' as never);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading your dashboard..." />;
  }

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <TopNavigation
        title="Dashboard"
        subtitle={`Welcome, ${user?.invoicingid}`}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Account Summary */}
        <Card variant="highlight" style={styles.accountCard}>
          <View style={styles.accountHeader}>
            <View>
              <Text style={styles.accountNumber}>
                {dashboardData?.customer.customer_number || 'Loading...'}
              </Text>
              <Text style={styles.accountName}>
                {dashboardData?.customer.name || user?.invoicingid}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusBadgeColor() }]}>
              <Text style={styles.statusText}>
                {dashboardData?.customer.status?.toUpperCase() || 'ACTIVE'}
              </Text>
            </View>
          </View>
          
          <View style={styles.packageInfo}>
            <Text style={styles.packageName}>
              {dashboardData?.usage.package_details.name || 'Loading...'}
            </Text>
            <Text style={styles.packageSpeed}>
              {apiService.formatSpeedForDisplay(dashboardData?.usage.package_details) || 'Loading...'}
            </Text>
            <Text style={styles.packageLimit}>
              Limit: {apiService.formatSubscriptionLimit(dashboardData?.usage.package_details)}
            </Text>
          </View>
        </Card>

        {/* Usage Summary */}
        {dashboardData?.usage.package_details.is_uncapped ? (
          <UncappedUsageCard
            downloadGb={dashboardData.usage.current_month.download_gb}
            uploadGb={dashboardData.usage.current_month.upload_gb}
            totalGb={dashboardData.usage.current_month.total_gb}
            packageName={dashboardData.usage.package_details.name || 'Unlimited Plan'}
          />
        ) : (
          <Card title="Data Usage" subtitle="Current Month">
            <View style={styles.usageContainer}>
              <View style={styles.usageChart}>
                <View style={styles.usageCircle}>
                  <View 
                    style={[
                      styles.usageProgress,
                      {
                        backgroundColor: getUsageColor(),
                        height: getUsagePercentage() !== null ? `${getUsagePercentage()!}%` : '0%',
                      }
                    ]} 
                  />
                  <View style={styles.usageContent}>
                    <Text style={[styles.usagePercentage, { color: getUsageTextColor() }]}>
                      {!dashboardData ? 'Loading...' : getUsagePercentage() !== null ? `${Math.round(getUsagePercentage()!)}%` : 'N/A'}
                    </Text>
                    <Text style={[styles.usageLabel, { color: getUsageTextColor() }]}>
                      {!dashboardData ? '' : getUsagePercentage() !== null ? 'Used' : 'Uncapped'}
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.usageDetails}>
                <View style={styles.usageRow}>
                  <Text style={styles.usageDetailLabel}>Downloaded</Text>
                  <Text style={styles.usageDetailValue}>
                    {dashboardData?.usage.current_month.download_gb.toFixed(1) || '0'} GB
                  </Text>
                </View>
                <View style={styles.usageRow}>
                  <Text style={styles.usageDetailLabel}>Uploaded</Text>
                  <Text style={styles.usageDetailValue}>
                    {dashboardData?.usage.current_month.upload_gb.toFixed(1) || '0'} GB
                  </Text>
                </View>
                <View style={styles.usageRow}>
                  <Text style={styles.usageDetailLabel}>Total Used</Text>
                  <Text style={[styles.usageDetailValue, styles.usageTotalValue]}>
                    {dashboardData?.usage.current_month.total_gb.toFixed(1) || '0'} GB
                  </Text>
                </View>
                <View style={styles.usageRow}>
                  <Text style={styles.usageDetailLabel}>Package Limit</Text>
                  <Text style={styles.usageDetailValue}>
                    {dashboardData?.usage.package_details.subscription_limit || 'N/A'}
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        )}

        {/* Quick Actions */}
        <Card title="Quick Actions">
          <View style={styles.quickActions}>
            <CustomButton
              title="View Usage"
              onPress={handleViewUsage}
              variant="outline"
              size="medium"
              style={styles.actionButton}
            />
            <CustomButton
              title="Pay Bill"
              onPress={handlePayBill}
              variant="primary"
              size="medium"
              style={styles.actionButton}
            />
          </View>
          <View style={styles.quickActions}>
            <CustomButton
              title="Support"
              onPress={handleSupport}
              variant="secondary"
              size="medium"
              style={styles.actionButton}
            />
            <CustomButton
              title="Invoices"
              onPress={handleInvoices}
              variant="secondary"
              size="medium"
              style={styles.actionButton}
            />
          </View>
        </Card>

        {/* Alerts & Notifications */}
        {(dashboardData?.current_outages?.length || 0) > 0 && (
          <Card title="Service Alerts" variant="highlight">
            {dashboardData?.current_outages.map((outage) => (
              <View key={outage.id} style={styles.alertItem}>
                <Ionicons name="warning" size={20} color={Colors.warning} />
                <View style={styles.alertContent}>
                  <Text style={styles.alertTitle}>{outage.title}</Text>
                  <Text style={styles.alertDescription}>{outage.description}</Text>
                </View>
              </View>
            ))}
          </Card>
        )}

        {/* Recent Invoices */}
        {(dashboardData?.recent_payments?.length || 0) > 0 && (
          <Card title="Recent Invoices">
            {dashboardData?.recent_payments.slice(0, 3).map((invoice: any, index: number, array: any[]) => (
              <View key={invoice.invoice_number} style={[
                styles.invoiceItem,
                index === array.length - 1 && styles.lastItem
              ]}>
                <View style={styles.invoiceHeader}>
                  <Text style={styles.invoiceNumber}>#{invoice.invoice_number}</Text>
                  <Text style={[styles.invoiceStatus, { 
                    color: invoice.status === 'paid' ? Colors.success : Colors.warning 
                  }]}>
                    {invoice.status.toUpperCase()}
                  </Text>
                </View>
                <View style={styles.invoiceDetails}>
                  <Text style={styles.invoiceAmount}>R{invoice.amount}</Text>
                  <Text style={styles.invoiceDate}>{invoice.date}</Text>
                </View>
              </View>
            ))}
          </Card>
        )}

        {/* Support Tickets */}
        {(dashboardData?.active_tickets?.length || 0) > 0 && (
          <Card title="Recent Support Tickets">
            {dashboardData?.active_tickets.map((ticket: any, index: number, array: any[]) => (
              <View key={ticket.id} style={[
                styles.ticketItem,
                index === array.length - 1 && styles.lastItem
              ]}>
                <View style={styles.ticketHeader}>
                  <Text style={styles.ticketTitle}>{ticket.title}</Text>
                  <Text style={[styles.ticketStatus, { color: getStatusColor(ticket.status) }]}>
                    {ticket.status.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.ticketCategory}>
                  {ticket.type?.toUpperCase() || 'SUPPORT'} • Priority: {ticket.priority || 'N/A'}
                </Text>
                <Text style={styles.ticketDate}>
                  Reported: {ticket.date_reported || 'N/A'}
                </Text>
              </View>
            ))}
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'open':
    case 'new':
      return Colors.primary;
    case 'in_progress':
    case 'assigned':
      return Colors.warning;
    case 'resolved':
    case 'closed':
      return Colors.success;
    default:
      return Colors.textSecondary;
  }
};

const styles = StyleSheet.create({
  container: {
    ...CommonStyles.safeArea,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  accountCard: {
    marginBottom: Spacing.md,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  accountNumber: {
    fontSize: Typography.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  accountName: {
    fontSize: Typography.md,
    color: Colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  statusText: {
    fontSize: Typography.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textInverse,
    letterSpacing: Typography.letterSpacing.wider,
  },
  packageInfo: {
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  packageName: {
    fontSize: Typography.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  packageSpeed: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  packageLimit: {
    fontSize: Typography.sm,
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
    marginTop: Spacing.xs,
  },
  usageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usageChart: {
    width: 120,
    height: 120,
    marginRight: Spacing.lg,
  },
  usageCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.surface,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  usageProgress: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 60,
  },
  usageContent: {
    alignItems: 'center',
  },
  usagePercentage: {
    fontSize: Typography.xl,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.xs,
  },
  usageLabel: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: Typography.letterSpacing.wider,
  },
  usageDetails: {
    flex: 1,
  },
  usageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  usageDetailLabel: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  usageDetailValue: {
    fontSize: Typography.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
  },
  usageTotalValue: {
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: Spacing.xs,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  alertContent: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  alertTitle: {
    fontSize: Typography.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  alertDescription: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.sm * Typography.lineHeights.relaxed,
  },
  ticketItem: {
    marginBottom: Spacing.sm,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  ticketTitle: {
    flex: 1,
    fontSize: Typography.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginRight: Spacing.sm,
  },
  ticketStatus: {
    fontSize: Typography.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: Typography.letterSpacing.wider,
  },
  ticketCategory: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    letterSpacing: Typography.letterSpacing.wider,
  },
  ticketDate: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    fontStyle: 'italic',
  },
  invoiceItem: {
    marginBottom: Spacing.sm,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  invoiceNumber: {
    fontSize: Typography.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
  },
  invoiceStatus: {
    fontSize: Typography.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: Typography.letterSpacing.wider,
  },
  invoiceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  invoiceAmount: {
    fontSize: Typography.md,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  invoiceDate: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
});
