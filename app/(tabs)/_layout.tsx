import { Tabs } from 'expo-router';
import { useAuthStore } from '@/stores/auth';
import { Redirect } from 'expo-router';
import { Dumbbell, Chrome as Home, ChartLine as LineChart, Target, Scale } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { colors } from '@/constants/colors';

export default function TabLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/welcome" />;
  }

  const TabBarBackground = () => (
    <LinearGradient
      colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.98)']}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      }}
    />
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarBackground: TabBarBackground,
        tabBarItemStyle: {
          padding: 4,
        },
        tabBarIconStyle: {
          marginBottom: 4,
        },
        tabBarLabelStyle: {
          fontFamily: 'Roboto-Medium',
          fontSize: 12,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Główna',
          tabBarIcon: ({ focused, size }) => (
            <Home size={size} color={focused ? colors.training.primary : colors.text.secondary} />
          ),
          tabBarActiveTintColor: colors.training.primary,
        }}
      />
      <Tabs.Screen
        name="training"
        options={{
          title: 'Treningi',
          tabBarIcon: ({ focused, size }) => (
            <Dumbbell size={size} color={focused ? colors.training.primary : colors.text.secondary} />
          ),
          tabBarActiveTintColor: colors.training.primary,
        }}
      />
      <Tabs.Screen
        name="measurements"
        options={{
          title: 'Pomiary',
          tabBarIcon: ({ focused, size }) => (
            <Scale size={size} color={focused ? colors.measurements.primary : colors.text.secondary} />
          ),
          tabBarActiveTintColor: colors.measurements.primary,
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: 'Cele',
          tabBarIcon: ({ focused, size }) => (
            <Target size={size} color={focused ? colors.goals.primary : colors.text.secondary} />
          ),
          tabBarActiveTintColor: colors.goals.primary,
        }}
      />
      <Tabs.Screen
        name="analysis"
        options={{
          title: 'Analiza',
          tabBarIcon: ({ focused, size }) => (
            <LineChart size={size} color={focused ? colors.training.primary : colors.text.secondary} />
          ),
          tabBarActiveTintColor: colors.training.primary,
        }}
      />
    </Tabs>
  );
}