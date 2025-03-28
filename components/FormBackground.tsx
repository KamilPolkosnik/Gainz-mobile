import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/colors';

interface FormBackgroundProps {
  children: React.ReactNode;
  type: 'training' | 'measurements' | 'goals';
  style?: ViewStyle;
}

export function FormBackground({ children, type, style }: FormBackgroundProps) {
  const getGradientColors = () => {
    switch (type) {
      case 'training':
        return [colors.training.light, colors.common.white];
      case 'measurements':
        return [colors.measurements.light, colors.common.white];
      case 'goals':
        return [colors.goals.light, colors.common.white];
      default:
        return [colors.common.white, colors.common.white];
    }
  };

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={getGradientColors()}
        style={styles.gradient}
      >
        {children}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  gradient: {
    flex: 1,
  },
});