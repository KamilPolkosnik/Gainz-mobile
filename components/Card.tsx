import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  useSharedValue,
  withSequence,
} from 'react-native-reanimated';
import { colors } from '@/constants/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  type?: 'training' | 'measurements' | 'goals';
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function Card({ children, style, type }: CardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getCardStyle = () => {
    if (!type) return {};
    return {
      backgroundColor: colors[type].card.background,
      borderColor: colors[type].card.border,
    };
  };

  return (
    <AnimatedView style={[styles.card, getCardStyle(), style, animatedStyle]}>
      {children}
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.common.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.common.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
});