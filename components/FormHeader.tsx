import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

interface FormHeaderProps {
  title: string;
  onClose: () => void;
  type?: 'training' | 'measurements' | 'goals';
}

export function FormHeader({ title, onClose, type = 'training' }: FormHeaderProps) {
  return (
    <LinearGradient
      colors={[colors.common.white, colors[type].light]}
      style={styles.container}
    >
      <Text style={[styles.title, { color: colors[type].primary }]}>{title}</Text>
      <TouchableOpacity 
        onPress={onClose}
        style={[styles.closeButton, { backgroundColor: colors[type].light }]}
      >
        <X size={24} color={colors[type].primary} />
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.common.border,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});