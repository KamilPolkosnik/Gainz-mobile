import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Video as LucideIcon } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import Animated, { FadeIn } from 'react-native-reanimated';

interface EmptyStateProps {
  icon: typeof LucideIcon;
  title: string;
  message: string;
  buttonText?: string;
  onButtonPress?: () => void;
  type?: 'training' | 'measurements' | 'goals';
  style?: ViewStyle;
}

export function EmptyState({
  icon: Icon,
  title,
  message,
  buttonText,
  onButtonPress,
  type = 'training',
  style,
}: EmptyStateProps) {
  return (
    <Animated.View 
      entering={FadeIn.delay(300)}
      style={[styles.container, style]}
    >
      <View style={[styles.iconContainer, { backgroundColor: colors[type].light }]}>
        <Icon size={48} color={colors[type].primary} strokeWidth={1.5} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {buttonText && onButtonPress && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors[type].primary }]}
          onPress={onButtonPress}
        >
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 40,
    alignItems: 'center',
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: '80%',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonText: {
    color: colors.common.white,
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
});