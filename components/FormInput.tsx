import { TextInput, View, Text, StyleSheet, ViewStyle, TextInputProps } from 'react-native';
import { colors } from '@/constants/colors';
import Animated, { FadeIn } from 'react-native-reanimated';

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: ViewStyle;
  type?: 'training' | 'measurements' | 'goals';
}

export function FormInput({ 
  label, 
  error, 
  containerStyle, 
  type = 'training',
  ...props 
}: FormInputProps) {
  const getBorderColor = () => {
    if (error) return colors.common.error;
    return colors.input.border;
  };

  const getLabelColor = () => {
    if (error) return colors.common.error;
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
    <Animated.View 
      entering={FadeIn}
      style={[styles.container, containerStyle]}
    >
      <Text style={[styles.label, { color: getLabelColor() }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          { borderColor: getBorderColor() },
        ]}
        placeholderTextColor={colors.input.placeholder}
        {...props}
      />
      {error && (
        <Text style={styles.error}>{error}</Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.input.background,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: colors.text.primary,
  },
  error: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: colors.common.error,
    marginTop: 4,
  },
});