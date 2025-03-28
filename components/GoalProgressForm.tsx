import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { X } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Goal } from '@/types/goal';

interface GoalProgressFormProps {
  onClose: () => void;
  onSubmit: (value: number) => void;
  goal: Goal;
}

export function GoalProgressForm({
  onClose,
  onSubmit,
  goal,
}: GoalProgressFormProps) {
  const [value, setValue] = useState(goal.currentValue.toString());

  const handleSubmit = () => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onSubmit(numValue);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Aktualizuj postęp</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Obecna wartość ({goal.unit})</Text>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={setValue}
            keyboardType="numeric"
            placeholder={`np. ${goal.targetValue}`}
          />
        </View>

        <View style={styles.info}>
          <Text style={styles.infoText}>
            Cel: {goal.targetValue} {goal.unit}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Zapisz</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  header: {
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
    color: colors.text.primary,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: colors.text.secondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.input.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.input.border,
  },
  info: {
    backgroundColor: colors.goals.light,
    padding: 16,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: colors.text.secondary,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.common.border,
  },
  submitButton: {
    backgroundColor: colors.goals.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: colors.common.white,
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
});