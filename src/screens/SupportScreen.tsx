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
import { useNavigation } from '@react-navigation/native';
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

export default function SupportScreen() {
  const navigation = useNavigation();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [category, setCategory] = useState('Technical Support');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

        {/* FAQ Link Card */}
        <Card title="Frequently Asked Questions">
          <View style={styles.faqLinkContainer}>
            <TouchableOpacity 
              style={styles.faqLinkButton}
              onPress={() => navigation.navigate('FAQ' as never)}
              activeOpacity={0.7}
            >
              <View style={styles.faqLinkContent}>
                <Ionicons name="help-circle" size={24} color={Colors.primary} />
                <View style={styles.faqLinkTextContainer}>
                  <Text style={styles.faqLinkTitle}>View All FAQs</Text>
                  <Text style={styles.faqLinkSubtitle}>
                    Find answers to common questions about our services, 
                    technical support, billing, and more.
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
              </View>
            </TouchableOpacity>
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
  faqLinkContainer: {
    padding: Spacing.sm,
  },
  faqLinkButton: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  faqLinkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  faqLinkTextContainer: {
    flex: 1,
  },
  faqLinkTitle: {
    fontSize: Typography.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  faqLinkSubtitle: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
    lineHeight: 18,
  },
});
