import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import TopNavigation from '../components/TopNavigation';
import Card from '../components/Card';
import { Colors, Typography, CommonStyles, Spacing } from '../constants/Design';
import { apiService } from '../services/api';
import { ReportIssueRequest } from '../types/api';

interface PriorityOption {
  value: 'low' | 'medium' | 'high' | 'urgent';
  label: string;
  color: string;
  icon: string;
}

interface CategoryOption {
  value: string;
  label: string;
  icon: string;
}

const PRIORITY_OPTIONS: PriorityOption[] = [
  { value: 'low', label: 'Low', color: Colors.success, icon: 'checkmark-circle' },
  { value: 'medium', label: 'Medium', color: Colors.warning, icon: 'information-circle' },
  { value: 'high', label: 'High', color: Colors.error, icon: 'alert-circle' },
  { value: 'urgent', label: 'Urgent', color: '#FF4444', icon: 'warning' },
];

const CATEGORY_OPTIONS: CategoryOption[] = [
  { value: 'Technical Support', label: 'Technical Support', icon: 'build' },
  { value: 'Billing Inquiry', label: 'Billing Inquiry', icon: 'card' },
  { value: 'Service Outage', label: 'Service Outage', icon: 'wifi' },
  { value: 'Account Issues', label: 'Account Issues', icon: 'person-circle' },
  { value: 'General Inquiry', label: 'General Inquiry', icon: 'help-circle' },
  { value: 'Feature Request', label: 'Feature Request', icon: 'bulb' },
];

const FAQ_DATA = [
  {
    question: "What are my email server settings?",
    answer: "If you have a ctecg.co.za email address and are using CTECG Internet:\n• Incoming mail server: mail.ctecg.co.za\n• Outgoing mail server: 10.1.8.2\n\nFor configuration help, contact our technical support team."
  },
  {
    question: "Why does my Internet connection keep disconnecting?",
    answer: "The most common cause is power variations - either low or high power supply to the equipment. We recommend:\n• Installing a UPS to protect equipment and prevent connection issues\n• Checking all power connections are secure\n• Ensuring your router is in a well-ventilated area"
  },
  {
    question: "How do I reboot my Internet connection?",
    answer: "To reboot your connection:\n1. Switch off the power to your router/modem for 1-2 minutes\n2. Turn the power back on\n3. Wait about 30 seconds for the system to boot up\n4. Check that all indicator lights are stable before testing your connection"
  },
  {
    question: "What internet packages do you offer?",
    answer: "We offer comprehensive internet solutions:\n• Capped packages starting at R99/month for 5GB\n• Uncapped packages starting at R450/month\n• Fibre and LTE options available\n• Business packages with dedicated support\n• Custom solutions for specific needs"
  },
  {
    question: "How many devices can use my connection?",
    answer: "The number of devices depends on your package:\n• More simultaneous connections require more bandwidth\n• Each device uses bandwidth for updates, anti-virus software, etc.\n• We can help you determine the right package based on your usage\n• Business packages support more devices with priority support"
  },
  {
    question: "How do I check my internet speed?",
    answer: "For accurate speed testing:\n1. Close all applications using bandwidth\n2. Ensure no other devices are using the connection\n3. Use our recommended test: www.speedtest.neotel.co.za\n4. Run multiple tests at different times for average results\n\nNote: Results may vary based on distance from test servers and network conditions."
  },
  {
    question: "Are there data limits on uncapped packages?",
    answer: "Our Uncapped packages have no data limits or 'capping':\n• Unlimited data usage\n• No throttling after certain usage\n• Fair usage policy applies for network stability\n• Starting at R450/month\n• Perfect for streaming, gaming, and heavy internet use"
  },
  {
    question: "How does weather affect my connection?",
    answer: "Weather generally doesn't affect connection quality, but:\n• We recommend unplugging equipment during thunderstorms\n• Lightning can cause damage to electronic equipment\n• Heavy rain rarely affects wireless signals\n• Our equipment is designed for South African weather conditions"
  },
  {
    question: "What technical support do you provide?",
    answer: "Comprehensive support services:\n• 24/7 helpdesk: helpdesk@ctecg.co.za\n• Phone support: +27 76 979 0642\n• WhatsApp support available\n• On-site technical visits when needed\n• Remote troubleshooting and configuration\n• Network optimization and security advice"
  },
  {
    question: "How do I report service outages?",
    answer: "Report outages through multiple channels:\n• This app's support form (priority: urgent)\n• Phone: +27 76 979 0642\n• Email: helpdesk@ctecg.co.za\n• WhatsApp: 076 979 0642\n• Our team monitors network status 24/7 and provides updates on repairs"
  },
  {
    question: "What cybersecurity services do you offer?",
    answer: "Complete cybersecurity solutions:\n• Content filtering and parental controls\n• Firewall configuration and management\n• Patch and asset management\n• Security monitoring and threat detection\n• Employee cybersecurity training\n• Regular security audits and updates"
  },
  {
    question: "Do you offer business solutions?",
    answer: "Comprehensive business services:\n• Dedicated internet connections\n• VoIP managed solutions\n• Network infrastructure setup\n• CCTV camera installations\n• Bulk SMS solutions\n• Hotspot WiFi management\n• 24/7 priority technical support"
  }
];

export default function SupportScreen() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [category, setCategory] = useState('Technical Support');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const handleSubmit = async () => {
    // Validation
    if (!subject.trim()) {
      Alert.alert('Error', 'Please enter a subject for your issue.');
      return;
    }

    if (!message.trim()) {
      Alert.alert('Error', 'Please describe your issue.');
      return;
    }

    setIsSubmitting(true);

    try {
      const issueData: ReportIssueRequest = {
        subject: subject.trim(),
        message: message.trim(),
        priority,
        category,
      };

      const response = await apiService.reportIssue(issueData);

      if (response.success) {
        Alert.alert(
          'Success',
          'Your issue has been reported successfully. Our support team will get back to you soon.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Reset form
                setSubject('');
                setMessage('');
                setPriority('medium');
                setCategory('Technical Support');
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', response.message || 'Failed to submit your issue. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting issue:', error);
      Alert.alert('Error', 'Failed to submit your issue. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <TopNavigation title="Support" subtitle="Get help & contact us" />
      <ScrollView style={styles.scrollView}>
        {/* Contact Info Card */}
        <Card title="Contact Information">
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <Ionicons name="mail" size={20} color={Colors.primary} />
              <Text style={styles.contactText}>support@ctecg.co.za</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="call" size={20} color={Colors.primary} />
              <Text style={styles.contactText}>+27 (0)11 123 4567</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="time" size={20} color={Colors.primary} />
              <Text style={styles.contactText}>Mon-Fri: 8:00 AM - 5:00 PM</Text>
            </View>
          </View>
        </Card>

        {/* Report Issue Form */}
        <Card title="Report an Issue">
          <View style={styles.form}>
            {/* Category Selection */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsContainer}>
                {CATEGORY_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionChip,
                      category === option.value && styles.selectedChip,
                    ]}
                    onPress={() => setCategory(option.value)}
                  >
                    <Ionicons 
                      name={option.icon as any} 
                      size={16} 
                      color={category === option.value ? Colors.surface : Colors.primary} 
                    />
                    <Text 
                      style={[
                        styles.optionText,
                        category === option.value && styles.selectedOptionText,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Subject Input */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Subject</Text>
              <TextInput
                style={styles.textInput}
                value={subject}
                onChangeText={setSubject}
                placeholder="Brief description of your issue"
                placeholderTextColor={Colors.textMuted}
                maxLength={100}
              />
              <Text style={styles.charCount}>{subject.length}/100</Text>
            </View>

            {/* Priority Selection */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Priority</Text>
              <View style={styles.priorityContainer}>
                {PRIORITY_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.priorityOption,
                      priority === option.value && { backgroundColor: option.color + '20' },
                    ]}
                    onPress={() => setPriority(option.value)}
                  >
                    <Ionicons 
                      name={option.icon as any} 
                      size={20} 
                      color={option.color} 
                    />
                    <Text 
                      style={[
                        styles.priorityText,
                        { color: priority === option.value ? option.color : Colors.text },
                      ]}
                    >
                      {option.label}
                    </Text>
                    {priority === option.value && (
                      <Ionicons name="checkmark-circle" size={16} color={option.color} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Message Input */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.textInput, styles.messageInput]}
                value={message}
                onChangeText={setMessage}
                placeholder="Please describe your issue in detail..."
                placeholderTextColor={Colors.textMuted}
                multiline
                textAlignVertical="top"
                maxLength={1000}
              />
              <Text style={styles.charCount}>{message.length}/1000</Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color={Colors.surface} size="small" />
              ) : (
                <>
                  <Ionicons name="send" size={20} color={Colors.surface} />
                  <Text style={styles.submitButtonText}>Submit Issue</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </Card>

        {/* FAQ Section */}
        <Card title="Frequently Asked Questions">
          <View style={styles.faqContainer}>
            {FAQ_DATA.map((faq, index) => (
              <View key={index} style={styles.faqItem}>
                <TouchableOpacity 
                  style={styles.faqQuestionContainer}
                  onPress={() => toggleFAQ(index)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  <Ionicons 
                    name={expandedFAQ === index ? "chevron-up" : "chevron-down"} 
                    size={16} 
                    color={Colors.textMuted} 
                  />
                </TouchableOpacity>
                {expandedFAQ === index && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...CommonStyles.safeArea,
  },
  scrollView: {
    flex: 1,
    padding: Spacing.md,
  },
  contactInfo: {
    gap: Spacing.md,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  contactText: {
    fontSize: Typography.md,
    color: Colors.text,
    flex: 1,
  },
  form: {
    gap: Spacing.lg,
  },
  formGroup: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: Typography.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
  },
  optionsContainer: {
    marginTop: Spacing.xs,
  },
  optionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.xs,
  },
  selectedChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionText: {
    fontSize: Typography.sm,
    color: Colors.text,
    fontWeight: Typography.weights.medium,
  },
  selectedOptionText: {
    color: Colors.surface,
  },
  priorityContainer: {
    gap: Spacing.sm,
  },
  priorityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  priorityText: {
    fontSize: Typography.md,
    fontWeight: Typography.weights.medium,
    flex: 1,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: Spacing.md,
    fontSize: Typography.md,
    color: Colors.text,
    backgroundColor: Colors.surface,
    minHeight: 48,
  },
  messageInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
    textAlign: 'right',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: 12,
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.textMuted,
  },
  submitButtonText: {
    fontSize: Typography.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.surface,
  },
  faqContainer: {
    gap: Spacing.sm,
  },
  faqItem: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    overflow: 'hidden',
  },
  faqQuestionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  faqQuestion: {
    fontSize: Typography.md,
    color: Colors.text,
    flex: 1,
    fontWeight: Typography.weights.medium,
  },
  faqAnswer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  faqAnswerText: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
    lineHeight: 20,
  },
});
