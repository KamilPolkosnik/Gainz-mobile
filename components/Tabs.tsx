import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Video as LucideIcon } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  interpolateColor,
  useDerivedValue,
} from 'react-native-reanimated';

interface Tab {
  id: string;
  label: string;
  icon: typeof LucideIcon;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  type?: 'training' | 'measurements' | 'goals';
  style?: ViewStyle;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export function Tabs({
  tabs,
  activeTab,
  onTabChange,
  type = 'training',
  style,
}: TabsProps) {
  return (
    <View style={[styles.container, style]}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        const Icon = tab.icon;

        return (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              isActive && { backgroundColor: colors[type].light },
            ]}
            onPress={() => onTabChange(tab.id)}
          >
            <Icon
              size={20}
              color={isActive ? colors[type].primary : colors.text.secondary}
              strokeWidth={2}
            />
            <Text
              style={[
                styles.tabLabel,
                isActive && { color: colors[type].primary },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.common.background,
  },
  tabLabel: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: colors.text.secondary,
  },
});