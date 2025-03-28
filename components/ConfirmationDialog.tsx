import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Modal } from './Modal';

interface ConfirmationDialogProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmationDialog({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Usuń',
  cancelText = 'Anuluj',
}: ConfirmationDialogProps) {
  return (
    <Modal visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>{cancelText}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.confirmButton]}
            onPress={() => {
              onConfirm();
              onClose();
            }}
          >
            <Text style={styles.confirmButtonText}>{confirmText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: '#666',
    marginBottom: 24,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
  },
  confirmButton: {
    backgroundColor: '#dc3545',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#666',
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#fff',
  },
});