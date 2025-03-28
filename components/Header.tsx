import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';
import { Video as LucideIcon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface HeaderProps {
  title: string;
  rightIcon?: typeof LucideIcon;
  onRightIconPress?: () => void;
  type?: 'training' | 'measurements' | 'goals';
  style?: ViewStyle;
}

export function Header({
  title,
  rightIcon: RightIcon,
  onRightIconPress,
  type = 'training',
  style,
}: HeaderProps) {
  return (
    <LinearGradient
      colors={[colors.common.white, colors[type].light]}
      style={[styles.container, style]}
    >
      <Text style={[styles.title, { color: colors[type].primary }]}>{title}</Text>
      {RightIcon && onRightIconPress && (
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: colors[type].light }]}
          onPress={onRightIconPress}
        >
          <RightIcon size={24} color={colors[type].primary} strokeWidth={2} />
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Roboto-Bold',
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});