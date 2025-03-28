import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Video as LucideIcon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, withSpring, useSharedValue, withSequence } from 'react-native-reanimated';
import { colors } from '@/constants/colors';

interface ActionButtonProps {
  icon: typeof LucideIcon;
  label: string;
  onPress: () => void;
  type: 'training' | 'measurements' | 'goals';
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export function ActionButton({ icon: Icon, label, onPress, type }: ActionButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(0.95, { damping: 10 }),
      withSpring(1, { damping: 10 })
    );
    onPress();
  };

  return (
    <AnimatedTouchableOpacity 
      style={[styles.buttonContainer, animatedStyle]} 
      onPress={handlePress}
    >
      <LinearGradient
        colors={colors[type].gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Icon size={24} color="#fff" strokeWidth={2} />
          <Text style={styles.label}>{label}</Text>
        </View>
      </LinearGradient>
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    height: 84,
  },
  gradient: {
    flex: 1,
    borderRadius: 12,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
  },
  label: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    textAlign: 'center',
  },
});