import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { 
  ApiResponse, 
  User, 
  AuthResponse, 
  CustomerData, 
  UsageSummary, 
  DetailedUsageData,
  DetailedBillingData,
  SupportTicket, 
  TicketMessage, 
  OutageReport, 
  Payment, 
  Invoice, 
  Notification,
  DashboardData,
  CheckUserResponse,
  PaymentInfo,
  PaymentRequest,
  PaymentResponse,
  EmailDisplay,
  OutagesResponse,
  ReportIssueRequest,
  ReportIssueResponse
} from '../types/api';

const API_BASE_URL = 'https://app.ctecg.co.za/api';

class ApiService {
  private authToken: string | null = null;
  private onAuthFailure: (() => void) | null = null;

  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  setAuthFailureCallback(callback: (() => void) | null) {
    this.onAuthFailure = callback;
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
      console.log('API Request with token:', {
        endpoint,
        tokenLength: this.authToken.length,
        hasToken: !!this.authToken
      });
    } else {
      console.log('API Request without token:', endpoint);
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log('API Response status:', response.status, endpoint);
      
      const responseText = await response.text();
      console.log('Raw response:', responseText.substring(0, 500)); // Log first 500 chars
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Response was:', responseText);
        throw new Error(`Invalid JSON response from server: ${responseText.substring(0, 100)}`);
      }
      
      if (!response.ok) {
        console.error('API Error response:', data);
        
        // Handle 401 Unauthorized - token expired or invalid
        // Only trigger auto-logout for authenticated endpoints (when we have a token)
        // and the error is specifically about token validation
        if (response.status === 401 && this.authToken && this.onAuthFailure) {
          // Check if this is a token validation failure (not a login attempt)
          const isLoginAttempt = endpoint.includes('action=login') || endpoint.includes('action=register');
          
          if (!isLoginAttempt) {
            console.log('🔴 Token expired/invalid, triggering logout');
            this.onAuthFailure();
          }
        }
        
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', { endpoint, error });
      throw error;
    }
  }

  // New Authentication Flow
  async checkUser(invoicingId: string): Promise<ApiResponse<CheckUserResponse>> {
    return this.makeRequest<CheckUserResponse>('/auth.php?action=check-user', {
      method: 'POST',
      body: JSON.stringify({
        invoicingid: invoicingId,
      }),
    });
  }

  async register(userData: {
    invoicingid: string;
    password: string;
    device_id?: string;
    fcm_token?: string;
  }): Promise<ApiResponse<AuthResponse>> {
    return this.makeRequest<AuthResponse>('/auth.php?action=register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(invoicingId: string, password: string): Promise<ApiResponse<AuthResponse>> {
    return this.makeRequest<AuthResponse>('/auth.php?action=login', {
      method: 'POST',
      body: JSON.stringify({
        invoicingid: invoicingId,
        password,
      }),
    });
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.makeRequest<User>('/auth.php?action=profile');
  }

  // Customer Data
  async getCustomerData(): Promise<ApiResponse<CustomerData>> {
    return this.makeRequest<CustomerData>('/customer.php?action=profile');
  }

  async getUsageData(): Promise<ApiResponse<UsageSummary>> {
    return this.makeRequest<UsageSummary>('/customer.php?action=usage');
  }

  async getDetailedUsageData(): Promise<ApiResponse<DetailedUsageData>> {
    try {
      console.log('getDetailedUsageData called, current authToken:', !!this.authToken);
      
      // If no token is set, try to load it from secure store
      if (!this.authToken) {
        const token = await SecureStore.getItemAsync('auth_token');
        console.log('Loaded token from SecureStore:', !!token);
        if (token) {
          this.setAuthToken(token);
          console.log('Token set, length:', token.length);
        } else {
          console.log('No token found in SecureStore');
          return {
            success: false,
            message: 'Authentication required - no token found',
            timestamp: new Date().toISOString()
          };
        }
      }

      console.log('Making request to usage-detailed endpoint');
      const response = await this.makeRequest<DetailedUsageData>(`/mobile-api.php?endpoint=usage-detailed`, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      console.error('getDetailedUsageData error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to load detailed usage data',
        timestamp: new Date().toISOString()
      };
    }
  }

  async getDetailedBillingData(): Promise<ApiResponse<DetailedBillingData>> {
    try {
      console.log('getDetailedBillingData called, current authToken:', !!this.authToken);
      
      // If no token is set, try to load it from secure store
      if (!this.authToken) {
        const token = await SecureStore.getItemAsync('auth_token');
        console.log('Loaded token from SecureStore:', !!token);
        if (token) {
          this.setAuthToken(token);
          console.log('Token set, length:', token.length);
        } else {
          console.log('No token found in SecureStore');
          return {
            success: false,
            message: 'Authentication required - no token found',
            timestamp: new Date().toISOString()
          };
        }
      }

      console.log('Making request to billing-detailed endpoint');
      const response = await this.makeRequest<DetailedBillingData>(`/mobile-api.php?endpoint=billing-detailed`, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      console.error('getDetailedBillingData error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to load detailed billing data',
        timestamp: new Date().toISOString()
      };
    }
  }

  // Dashboard
  async getDashboardData(): Promise<ApiResponse<DashboardData>> {
    try {
      console.log('getDashboardData called, current authToken:', !!this.authToken);
      
      // If no token is set, try to load it from secure store
      if (!this.authToken) {
        const token = await SecureStore.getItemAsync('auth_token');
        console.log('Loaded token from SecureStore:', !!token);
        if (token) {
          this.setAuthToken(token);
          console.log('Token set, length:', token.length);
        } else {
          console.log('No token found in SecureStore');
          return {
            success: false,
            message: 'Authentication required - no token found',
            timestamp: new Date().toISOString()
          };
        }
      }

      console.log('Making request to dashboard endpoint');
      const response = await this.makeRequest<any>(`/mobile-api.php?endpoint=dashboard`, {
        method: 'GET',
      });

      console.log('Dashboard API Response:', {
        success: response.success,
        hasData: !!response.data,
        dataKeys: response.data ? Object.keys(response.data) : []
      });

      if (response.success && response.data) {
        // Map the API response to our DashboardData interface
        const apiData = response.data;
        
        // Handle email field which can be a string or object
        const displayEmail = this.formatEmailForDisplay(apiData.customer_info?.email);
        
        console.log('Email processing:', {
          originalEmail: apiData.customer_info?.email,
          displayEmail,
          emailType: typeof apiData.customer_info?.email
        });

        console.log('Service status details:', {
          status: apiData.service_status?.status,
          connection: apiData.service_status?.connection,
          location: apiData.service_status?.location,
          isUncapped: apiData.service_status?.is_uncapped
        });
        
        const dashboardData: DashboardData = {
          customer_info: {
            name: apiData.customer_info?.name || '',
            id: apiData.customer_info?.id || '',
            customerid: parseInt(apiData.customer_info?.customerid) || 0,
            status: apiData.customer_info?.status || '',
            service_type: apiData.customer_info?.service_type || '',
            email: displayEmail,
            package_description: apiData.customer_info?.package_description || '',
            package_name: apiData.customer_info?.package_name || '',
            package_code: apiData.customer_info?.package_code || '',
            site_name: apiData.customer_info?.site_name || '',
          },
          customer: {
            customer_number: apiData.customer_info?.id || '',
            name: apiData.customer_info?.name || '',
            email: displayEmail,
            phone: '',
            address: '',
            package_name: apiData.customer_info?.package_name || apiData.service_status?.subscription_plan || '',
            package_speed: `${apiData.service_status?.download_speed_mbps || 0}/${apiData.service_status?.upload_speed_mbps || 0}MBPS`,
            monthly_fee: 0,
            status: apiData.customer_info?.status || '',
            installation_date: '',
            last_payment_date: apiData.billing_summary?.latest_invoice?.date || '',
            balance: parseFloat(apiData.billing_summary?.current_balance || '0'),
            service_type: apiData.customer_info?.service_type || '',
            customerid: apiData.customer_info?.customerid || 0
          },
          usage: {
            current_month: {
              download_gb: apiData.usage_summary?.download_gb || 0,
              upload_gb: apiData.usage_summary?.upload_gb || 0,
              total_gb: apiData.usage_summary?.total_gb || 0,
              days_remaining: 30,
              daily_average: (apiData.usage_summary?.total_gb || 0) / 30,
              period: apiData.usage_summary?.period || 'Current Month'
            },
            previous_month: {
              download_gb: 0,
              upload_gb: 0,
              total_gb: 0
            },
            package_details: {
              name: apiData.customer_info?.package_name || apiData.service_status?.subscription_plan || '',
              speed: apiData.service_status?.plan || `${apiData.service_status?.download_speed_mbps || 0}/${apiData.service_status?.upload_speed_mbps || 0}MBPS`,
              limit_gb: apiData.service_status?.limit_gb_numeric || 0,
              monthly_fee: 0,
              subscription_plan: apiData.service_status?.subscription_plan || '',
              subscription_limit: apiData.service_status?.subscription_limit || 'N/A',
              download_speed_mbps: apiData.service_status?.download_speed_mbps || 0,
              upload_speed_mbps: apiData.service_status?.upload_speed_mbps || 0,
              is_uncapped: apiData.service_status?.is_uncapped || false
            }
          },
          service: {
            status: apiData.service_status?.status || '',
            connection: apiData.service_status?.connection || '',
            ip_address: apiData.service_status?.ip_address || '',
            plan: apiData.service_status?.plan || `${apiData.service_status?.download_speed_mbps || 0}/${apiData.service_status?.upload_speed_mbps || 0}MBPS`,
            location: apiData.service_status?.location || ''
          },
          billing: {
            current_balance: apiData.billing_summary?.current_balance || '0.00',
            latest_invoice: apiData.billing_summary?.latest_invoice || null,
            next_billing_date: apiData.billing_summary?.next_billing_date || ''
          },
          alerts: {
            open_tickets: apiData.alerts?.open_tickets || 0,
            service_issues: apiData.alerts?.service_issues || 0,
            unpaid_invoices: apiData.alerts?.unpaid_invoices || 0,
            connection_status: apiData.alerts?.connection_status || apiData.service_status?.connection || ''
          },
          recent_payments: apiData.billing_summary?.recent_invoices || [],
          outstanding_invoices: [], // Not provided in current API response
          active_tickets: apiData.maintenance?.recent_tickets || [],
          current_outages: [], // Not provided in current API response
          unread_notifications: 0 // Not provided in current API response
        };

        return {
          success: true,
          message: 'Dashboard data loaded',
          data: dashboardData,
          timestamp: new Date().toISOString()
        };
      } else {
        return {
          success: false,
          message: response.message || 'Failed to fetch dashboard data',
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString()
      };
    }
  }

  // Utility methods for formatting data
  formatEmailForDisplay(emailData: any): EmailDisplay {
    if (typeof emailData === 'object' && emailData !== null) {
      // Handle new email object structure from API
      if (emailData.primary_email) {
        return {
          primary_email: emailData.primary_email,
          email_count: emailData.email_count || 1,
          all_emails: emailData.all_emails || [emailData.primary_email],
          display_text: emailData.display_text || emailData.primary_email,
          has_email: emailData.has_email !== undefined ? emailData.has_email : true
        };
      }
      if (emailData.all_emails && Array.isArray(emailData.all_emails) && emailData.all_emails.length > 0) {
        const primaryEmail = emailData.all_emails[0];
        return {
          primary_email: primaryEmail,
          email_count: emailData.all_emails.length,
          all_emails: emailData.all_emails,
          display_text: emailData.all_emails.length > 1 ? `${primaryEmail} (+${emailData.all_emails.length - 1} more)` : primaryEmail,
          has_email: true
        };
      }
    }
    if (typeof emailData === 'string' && emailData.trim()) {
      // Handle legacy string format or comma-separated emails
      const emails = emailData.split(',').map(email => email.trim()).filter(email => email);
      const primaryEmail = emails[0];
      return {
        primary_email: primaryEmail,
        email_count: emails.length,
        all_emails: emails,
        display_text: emails.length > 1 ? `${primaryEmail} (+${emails.length - 1} more)` : primaryEmail,
        has_email: true
      };
    }
    
    // Return empty structure if no valid email data
    return {
      primary_email: null,
      email_count: 0,
      all_emails: [],
      display_text: 'No email',
      has_email: false
    };
  }

  formatConnectionStatus(serviceStatus: any): string {
    if (serviceStatus?.connection_details?.message) {
      return serviceStatus.connection_details.message;
    }
    return serviceStatus?.connection || 'Unknown';
  }

  formatUsageForDisplay(usage: any) {
    return {
      download: `${usage.download_gb?.toFixed(2) || '0.00'} GB`,
      upload: `${usage.upload_gb?.toFixed(2) || '0.00'} GB`,
      total: `${usage.total_gb?.toFixed(2) || '0.00'} GB`,
      formattedTotal: usage.formatted_total || `${usage.total_gb?.toFixed(2) || '0.00'} GB`
    };
  }

  formatSpeedForDisplay(packageDetails: any) {
    if (packageDetails.download_speed_mbps && packageDetails.upload_speed_mbps) {
      return `${packageDetails.download_speed_mbps}/${packageDetails.upload_speed_mbps}MBPS`;
    }
    return packageDetails.speed || 'N/A';
  }

  formatSubscriptionLimit(packageDetails: any) {
    if (packageDetails.is_uncapped) {
      return 'Unlimited';
    }
    return packageDetails.subscription_limit || `${packageDetails.limit_gb} GB`;
  }
  async getSupportTickets(): Promise<ApiResponse<SupportTicket[]>> {
    return this.makeRequest<SupportTicket[]>('/support.php?action=list');
  }

  async createSupportTicket(ticketData: {
    title: string;
    description: string;
    category: string;
    priority: string;
  }): Promise<ApiResponse<SupportTicket>> {
    return this.makeRequest<SupportTicket>('/support.php?action=create', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });
  }

  async getTicketMessages(ticketId: number): Promise<ApiResponse<TicketMessage[]>> {
    return this.makeRequest<TicketMessage[]>(`/support.php?action=messages&ticket_id=${ticketId}`);
  }

  async addTicketMessage(ticketId: number, message: string): Promise<ApiResponse<TicketMessage>> {
    return this.makeRequest<TicketMessage>('/support.php?action=add_message', {
      method: 'POST',
      body: JSON.stringify({
        ticket_id: ticketId,
        message,
      }),
    });
  }

  // Outages
  async getOutages(): Promise<ApiResponse<OutagesResponse>> {
    return this.makeRequest<OutagesResponse>('/mobile-api.php?endpoint=outages');
  }

  async reportOutage(outageData: {
    description: string;
    location: string;
    severity: string;
  }): Promise<ApiResponse<any>> {
    return this.makeRequest('/outage.php?action=report', {
      method: 'POST',
      body: JSON.stringify(outageData),
    });
  }

  // Payments
  async getPayments(): Promise<ApiResponse<Payment[]>> {
    return this.makeRequest<Payment[]>('/payment.php?action=list');
  }

  async initiatePayment(paymentData: {
    amount: number;
    method: string;
    description: string;
  }): Promise<ApiResponse<any>> {
    return this.makeRequest('/payment.php?action=initiate', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  // Invoices
  async getInvoices(): Promise<ApiResponse<Invoice[]>> {
    return this.makeRequest<Invoice[]>('/customer.php?action=invoices');
  }

  async getInvoice(invoiceId: number): Promise<ApiResponse<Invoice>> {
    return this.makeRequest<Invoice>(`/customer.php?action=invoice&id=${invoiceId}`);
  }

  // Notifications
  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    return this.makeRequest<Notification[]>('/notifications.php?action=list');
  }

  async markNotificationAsRead(notificationId: number): Promise<ApiResponse<any>> {
    return this.makeRequest('/notifications.php?action=mark_read', {
      method: 'POST',
      body: JSON.stringify({
        notification_id: notificationId,
      }),
    });
  }

  async updateNotificationSettings(settings: {
    email_notifications: boolean;
    push_notifications: boolean;
    sms_notifications: boolean;
    billing_alerts: boolean;
    outage_alerts: boolean;
    maintenance_alerts: boolean;
  }): Promise<ApiResponse<any>> {
    return this.makeRequest('/notifications.php?action=update_settings', {
      method: 'POST',
      body: JSON.stringify(settings),
    });
  }
  // Debug endpoints
  async testDatabase(): Promise<any> {
    return this.makeRequest('/debug.php?action=test-database');
  }

  async testToken(): Promise<any> {
    return this.makeRequest('/debug.php?action=test-token');
  }

  async listTokens(): Promise<any> {
    return this.makeRequest('/debug.php?action=list-tokens');
  }

  async testAuth(): Promise<any> {
    const url = `${API_BASE_URL}/test-auth.php`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'text/plain',
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      const text = await response.text();
      console.log('Test Auth Response:', text);
      return { response: text };
    } catch (error) {
      console.error('Test Auth failed:', error);
      throw error;
    }
  }

  // Payment Methods
  async getPaymentInfo(): Promise<ApiResponse<PaymentInfo>> {
    return this.makeRequest<PaymentInfo>('/mobile-api.php?endpoint=payment-info');
  }

  async createPayment(paymentData: PaymentRequest): Promise<ApiResponse<PaymentResponse>> {
    return this.makeRequest<PaymentResponse>('/mobile-api.php?endpoint=create-payment', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async getPaymentStatus(paymentId: string): Promise<ApiResponse<any>> {
    return this.makeRequest<any>(`/mobile-api.php?endpoint=payment-status&payment_id=${paymentId}`);
  }

  // Report Issue (Support)
  async reportIssue(issueData: ReportIssueRequest): Promise<ApiResponse<ReportIssueResponse>> {
    return this.makeRequest<ReportIssueResponse>('/mobile-api.php?action=report-issue', {
      method: 'POST',
      body: JSON.stringify(issueData),
    });
  }
}

export const apiService = new ApiService();
