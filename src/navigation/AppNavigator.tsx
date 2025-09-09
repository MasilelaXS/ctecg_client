import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DashboardScreen from '../screens/DashboardScreen';
import UsageScreen from '../screens/UsageScreen';
import BillingScreen from '../screens/BillingScreen';
import SupportScreen from '../screens/SupportScreen';
import OutageScreen from '../screens/OutageScreen';
import { Colors, Typography } from '../constants/Design';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Usage':
              iconName = focused ? 'bar-chart' : 'bar-chart-outline';
              break;
            case 'Billing':
              iconName = focused ? 'card' : 'card-outline';
              break;
            case 'Support':
              iconName = focused ? 'help-circle' : 'help-circle-outline';
              break;
            case 'Outages':
              iconName = focused ? 'warning' : 'warning-outline';
              break;
            default:
              iconName = 'home-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 8,
          height: 60 + Math.max(insets.bottom, 0),
        },
        tabBarLabelStyle: {
          fontSize: Typography.xs,
          fontWeight: Typography.weights.medium,
          letterSpacing: Typography.letterSpacing.wide,
        },
        tabBarButton: (props) => (
          <TouchableWithoutFeedback onPress={props.onPress}>
            <View style={props.style}>
              {props.children}
            </View>
          </TouchableWithoutFeedback>
        ),
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Usage" component={UsageScreen} />
      <Tab.Screen name="Billing" component={BillingScreen} />
      <Tab.Screen name="Outages" component={OutageScreen} />
      <Tab.Screen name="Support" component={SupportScreen} />
    </Tab.Navigator>
  );
}
