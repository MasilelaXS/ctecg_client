import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  ApiResponse, 
  User, 
  AuthResponse, 
  CustomerData, 
  UsageSummary, 
  SupportTicket, 
  TicketMessage, 
  OutageReport, 
  Payment, 
  Invoice, 
  Notification, 
  SimpleDashboardData,
  DashboardData,
  CheckUserResponse 
} from '../types/api';

const API_BASE_URL = 'https://app.ctecg.co.za/api';

class ApiService {
  private authToken: string | null = null;

  setAuthToken(token: string | null) {
    this.authToken = token;
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
    try {
      const response = await this.makeRequest<any>('/auth.php?action=check_user', {
        method: 'POST',
        body: JSON.stringify({
          invoicing_id: invoicingId
        })
      });

      if (response.success && response.data) {
        return {
          success: true,
          data: {
            user_exists: response.data.user_exists,
            needs_registration: response.data.needs_registration,
            invoicingid: response.data.invoicingid,
            customer_data: {
              name: response.data.customer_data.name,
              email: response.data.customer_data.email
            }
          } as CheckUserResponse,
          message: response.message || 'User check completed',
          timestamp: new Date().toISOString()
        };
      } else {
        return {
          success: false,
          message: response.message || 'Failed to check user',
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

  async register(userData: {
    invoicingid: string;
    password: string;
    device_id?: string;
    fcm_token?: string;
  }): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await this.makeRequest<any>('/auth.php?action=register', {
        method: 'POST',
        body: JSON.stringify({
          invoicing_id: userData.invoicingid,
          password: userData.password,
          device_id: userData.device_id,
          fcm_token: userData.fcm_token
        }),
      });

      if (response.success && response.data) {
        // Store authentication data
        await AsyncStorage.setItem('auth_token', response.data.token);
        await AsyncStorage.setItem('invoicing_id', response.data.user.invoicingid);
        this.setAuthToken(response.data.token);

        return {
          success: true,
          data: {
            token: response.data.token,
            user: {
              id: response.data.user.id.toString(),
              username: response.data.user.invoicingid,
              email: response.data.user.email || '',
              firstName: response.data.user.firstName || '',
              lastName: response.data.user.lastName || '',
              invoicingid: response.data.user.invoicingid
            }
          } as AuthResponse,
          message: response.message || 'Registration successful',
          timestamp: new Date().toISOString()
        };
      } else {
        return {
          success: false,
          message: response.message || 'Registration failed',
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed',
        timestamp: new Date().toISOString()
      };
    }
  }

  async login(invoicingId: string, password: string): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await this.makeRequest<any>('/auth.php?action=login', {
        method: 'POST',
        body: JSON.stringify({
          invoicing_id: invoicingId,
          password: password
        }),
      });

      if (response.success && response.data) {
        // Store authentication data
        await AsyncStorage.setItem('auth_token', response.data.token);
        await AsyncStorage.setItem('invoicing_id', response.data.user.invoicingid);
        this.setAuthToken(response.data.token);

        return {
          success: true,
          data: {
            token: response.data.token,
            user: {
              id: response.data.user.id.toString(),
              username: response.data.user.invoicingid,
              email: response.data.user.email || '',
              firstName: response.data.user.firstName || '',
              lastName: response.data.user.lastName || '',
              invoicingid: response.data.user.invoicingid
            }
          } as AuthResponse,
          message: response.message || 'Login successful',
          timestamp: new Date().toISOString()
        };
      } else {
        return {
          success: false,
          message: response.message || 'Login failed',
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Login failed',
        timestamp: new Date().toISOString()
      };
    }
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

  // Dashboard
  async getDashboardData(): Promise<ApiResponse<SimpleDashboardData>> {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const invoicingId = await AsyncStorage.getItem('invoicing_id');
      
      if (!token || !invoicingId) {
        return {
          success: false,
          message: 'Authentication required',
          timestamp: new Date().toISOString()
        };
      }

      const response = await this.makeRequest<any>(`/mobile-api.php?endpoint=dashboard&customer_id=${encodeURIComponent(invoicingId)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.success && response.data) {
        // Map the API response to our SimpleDashboardData interface
        const apiData = response.data as any;
        
        const simpleDashboard: SimpleDashboardData = {
          speed: apiData.service_status?.plan || 'Unknown',
          used: `${apiData.usage_summary?.total_gb || 0}GB`,
          package1: apiData.service_status?.plan || 'Unknown',
          subscription: apiData.usage_summary?.total_gb ? `${apiData.usage_summary.total_gb}GB` : 'Uncapped',
          status: apiData.customer_info?.status || 'Active'
        };

        return {
          success: true,
          message: 'Dashboard data loaded',
          data: simpleDashboard,
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

  // Support Tickets
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
  async getOutages(): Promise<ApiResponse<OutageReport[]>> {
    return this.makeRequest<OutageReport[]>('/outage.php?action=list');
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
}

export const apiService = new ApiService();
