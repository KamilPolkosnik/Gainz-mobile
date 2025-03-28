import { Modal as RNModal, View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ visible, onClose, children }: ModalProps) {
  return (
    <RNModal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      transparent
    >
      <View style={styles.overlay}>
        <BlurView intensity={Platform.OS === 'ios' ? 25 : 100} style={StyleSheet.absoluteFill} />
        <View style={styles.content}>{children}</View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 44 : 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
});