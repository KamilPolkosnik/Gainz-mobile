import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  useSharedValue,
  withSequence,
} from 'react-native-reanimated';
import { colors } from '@/constants/colors';

interface SummaryCardProps {
  title: string;
  emptyMessage: string;
  onAdd: () => void;
  onPress?: () => void;
  children?: React.ReactNode;
  type: 'training' | 'measurements' | 'goals';
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function SummaryCard({ 
  title, 
  emptyMessage, 
  onAdd, 
  onPress,
  children, 
  type 
}: SummaryCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(0.95, { damping: 10 }),
      withSpring(1, { damping: 10 })
    );
    if (children) {
      onPress?.();
    } else {
      onAdd();
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'training':
        return colors.training.light;
      case 'measurements':
        return colors.measurements.light;
      case 'goals':
        return colors.goals.light;
      default:
        return colors.common.white;
    }
  };

  const getTitleColor = () => {
    switch (type) {
      case 'training':
        return colors.training.primary;
      case 'measurements':
        return colors.measurements.primary;
      case 'goals':
        return colors.goals.primary;
      default:
        return colors.text.primary;
    }
  };

  return (
    <AnimatedView style={[styles.cardContainer, animatedStyle]}>
      <View style={styles.card}>
        <Text style={[styles.title, { color: getTitleColor() }]}>{title}</Text>
        <TouchableOpacity 
          onPress={handlePress}
          style={[
            styles.contentContainer, 
            { backgroundColor: getBackgroundColor() }
          ]}
        >
          {children || (
            <Text style={styles.emptyText}>{emptyMessage}</Text>
          )}
        </TouchableOpacity>
      </View>
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eee',
    minHeight: 160,
    backgroundColor: colors.common.white,
  },
  contentContainer: {
    flex: 1,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
  },
  emptyText: {
    color: colors.text.secondary,
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
  },
});