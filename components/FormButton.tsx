import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue,
  withSequence,
} from 'react-native-reanimated';

interface FormButtonProps {
  label: string;
  onPress: () => void;
  type?: 'training' | 'measurements' | 'goals';
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export function FormButton({ 
  label, 
  onPress, 
  type = 'training',
  variant = 'primary',
  style,
}: FormButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(0.95),
      withSpring(1)
    );
    onPress();
  };

  const getGradientColors = () => {
    if (variant === 'secondary') {
      return [colors.common.white, colors.common.white];
    }
    return colors[type].gradient;
  };

  const getTextColor = () => {
    if (variant === 'secondary') {
      return colors[type].primary;
    }
    return colors.common.white;
  };

  return (
    <AnimatedTouchableOpacity
      onPress={handlePress}
      style={[
        styles.container,
        variant === 'secondary' && { borderWidth: 2, borderColor: colors[type].primary },
        style,
        animatedStyle,
      ]}
    >
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Text style={[styles.label, { color: getTextColor() }]}>{label}</Text>
      </LinearGradient>
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  gradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
});