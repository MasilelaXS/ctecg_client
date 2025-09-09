import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../constants/Design';

interface PaymentWebViewProps {
  visible: boolean;
  paymentUrl: string;
  formData: Record<string, string>;
  onSuccess: (paymentId: string) => void;
  onCancel: () => void;
  onError: (error: string) => void;
}

export default function PaymentWebView({
  visible,
  paymentUrl,
  formData,
  onSuccess,
  onCancel,
  onError,
}: PaymentWebViewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState('');
  const webViewRef = useRef<WebView>(null);

  const createPaymentForm = () => {
    const formFields = Object.entries(formData)
      .map(([key, value]) => `<input type="hidden" name="${key}" value="${value}" />`)
      .join('\n');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Secure Payment - PayFast</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
              margin: 0;
              padding: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 16px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.1);
              text-align: center;
              max-width: 450px;
              width: 100%;
              position: relative;
              overflow: hidden;
            }
            .container::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 4px;
              background: linear-gradient(90deg, #cc0000, #ff4444);
            }
            .spinner {
              border: 3px solid #f3f3f3;
              border-top: 3px solid #cc0000;
              border-radius: 50%;
              width: 50px;
              height: 50px;
              animation: spin 1s linear infinite;
              margin: 0 auto 20px;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            h2 {
              color: #333;
              margin-bottom: 15px;
              font-size: 24px;
              font-weight: 600;
            }
            p {
              color: #666;
              margin-bottom: 25px;
              line-height: 1.5;
              font-size: 16px;
            }
            .secure-badge {
              display: inline-flex;
              align-items: center;
              background: #e8f5e8;
              color: #2d5a2d;
              padding: 12px 20px;
              border-radius: 8px;
              font-size: 14px;
              font-weight: 500;
              margin-top: 15px;
              gap: 8px;
            }
            .progress-bar {
              width: 100%;
              height: 4px;
              background: #f0f0f0;
              border-radius: 2px;
              margin: 20px 0;
              overflow: hidden;
            }
            .progress-fill {
              height: 100%;
              background: linear-gradient(90deg, #cc0000, #ff4444);
              width: 0%;
              animation: progress 3s ease-out forwards;
            }
            @keyframes progress {
              0% { width: 0%; }
              50% { width: 60%; }
              100% { width: 100%; }
            }
            .footer-text {
              margin-top: 20px;
              font-size: 12px;
              color: #999;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="spinner"></div>
            <h2>Connecting to PayFast</h2>
            <p>Please wait while we securely redirect you to our payment processor...</p>
            <div class="progress-bar">
              <div class="progress-fill"></div>
            </div>
            <div class="secure-badge">
              🔒 256-bit SSL Encryption by PayFast
            </div>
            <div class="footer-text">
              PCI DSS Level 1 Compliant • South Africa's leading payment gateway
            </div>
          </div>
          <form id="payfast-form" action="${paymentUrl}" method="post" style="display: none;">
            ${formFields}
          </form>
          <script>
            let redirected = false;
            
            // Auto-submit after 2.5 seconds
            setTimeout(() => {
              if (!redirected) {
                redirected = true;
                document.getElementById('payfast-form').submit();
              }
            }, 2500);
            
            // Fallback: Allow manual submission if auto-submit fails
            setTimeout(() => {
              if (!redirected) {
                const container = document.querySelector('.container');
                container.innerHTML += '<br><button onclick="document.getElementById(\\'payfast-form\\').submit();" style="background: #cc0000; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px;">Continue to Payment</button>';
              }
            }, 5000);
          </script>
        </body>
      </html>
    `;
  };

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    const { url } = navState;
    setCurrentUrl(url);
    setIsLoading(navState.loading);

    console.log('WebView navigation:', url);

    // Check for success URL (more specific detection)
    if (url.includes('payment-success') && url.includes('status=success')) {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      const paymentId = urlParams.get('payment_id');
      const status = urlParams.get('status');
      
      if (paymentId && status === 'success') {
        setTimeout(() => {
          onSuccess(paymentId);
        }, 1000); // Small delay to show success page
      } else {
        onError('Payment completed but verification failed');
      }
      return;
    }

    // Check for cancel URL (more specific detection)
    if (url.includes('payment-cancelled') && url.includes('status=cancelled')) {
      setTimeout(() => {
        onCancel();
      }, 1000);
      return;
    }

    // Check for PayFast success patterns - enhanced detection
    if (url.includes('return_url') || url.includes('payment_status=COMPLETE') || 
        (url.includes('success') && url.includes('payfast')) ||
        url.includes('payment_status=complete')) {
      // PayFast successful payment return
      const urlParams = new URLSearchParams(url.split('?')[1]);
      const paymentId = urlParams.get('m_payment_id') || urlParams.get('payment_id') || 
                       urlParams.get('pf_payment_id') || 'success';
      
      setTimeout(() => {
        onSuccess(paymentId);
      }, 1000);
      return;
    }

    // Check for PayFast cancel patterns - enhanced detection
    if (url.includes('cancel') || url.includes('payment_status=CANCELLED') ||
        url.includes('payment_status=cancelled') || 
        (url.includes('cancelled') && url.includes('payfast'))) {
      setTimeout(() => {
        onCancel();
      }, 1000);
      return;
    }

    // Check for error patterns - enhanced detection
    if (url.includes('error') || url.includes('failed') || 
        url.includes('payment_status=FAILED') || url.includes('payment_status=failed') ||
        (url.includes('fail') && url.includes('payfast'))) {
      const errorMessage = url.includes('timeout') ? 'Payment timed out' :
                          url.includes('declined') ? 'Payment was declined' :
                          url.includes('insufficient') ? 'Insufficient funds' :
                          'Payment failed';
      onError(errorMessage);
      return;
    }

    // Check for PayFast domain patterns
    if (url.includes('payfast.co.za')) {
      // We're on PayFast domain, check for specific status indicators
      if (url.includes('/success') || url.includes('/complete')) {
        setTimeout(() => {
          onSuccess('payfast_success');
        }, 1000);
        return;
      }
      
      if (url.includes('/cancel') || url.includes('/cancelled')) {
        setTimeout(() => {
          onCancel();
        }, 1000);
        return;
      }
      
      if (url.includes('/error') || url.includes('/fail')) {
        onError('Payment processing failed');
        return;
      }
    }
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
    
    // Provide more specific error messages
    let errorMessage = 'Payment page failed to load';
    
    if (nativeEvent.description) {
      if (nativeEvent.description.includes('network')) {
        errorMessage = 'Network connection error. Please check your internet connection.';
      } else if (nativeEvent.description.includes('timeout')) {
        errorMessage = 'Connection timed out. Please try again.';
      } else if (nativeEvent.description.includes('SSL') || nativeEvent.description.includes('certificate')) {
        errorMessage = 'Secure connection error. Please try again.';
      }
    }
    
    onError(errorMessage);
  };

  const handleClose = () => {
    Alert.alert(
      'Cancel Payment',
      'Are you sure you want to cancel this payment?',
      [
        { text: 'Continue Payment', style: 'default' },
        { 
          text: 'Cancel Payment', 
          style: 'destructive',
          onPress: onCancel
        }
      ]
    );
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Secure Payment</Text>
          <View style={styles.placeholder} />
        </View>

        {/* URL Bar */}
        <View style={styles.urlBar}>
          <Ionicons 
            name={currentUrl.includes('https') ? 'lock-closed' : 'globe'} 
            size={16} 
            color={currentUrl.includes('https') ? Colors.success : Colors.warning} 
          />
          <Text style={styles.urlText} numberOfLines={1}>
            {currentUrl || 'Loading...'}
          </Text>
        </View>

        {/* WebView */}
        <View style={styles.webViewContainer}>
          <WebView
            ref={webViewRef}
            source={{ html: createPaymentForm() }}
            onNavigationStateChange={handleNavigationStateChange}
            onError={handleError}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Loading secure payment...</Text>
              </View>
            )}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            style={styles.webView}
          />
        </View>

        {/* Loading Overlay */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Processing...</Text>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
  },
  placeholder: {
    width: 32, // Same as close button to center title
  },
  urlBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.sm,
  },
  urlText: {
    flex: 1,
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  webViewContainer: {
    flex: 1,
    position: 'relative',
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  loadingText: {
    marginTop: Spacing.sm,
    fontSize: Typography.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
