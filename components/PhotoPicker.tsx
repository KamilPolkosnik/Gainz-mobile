import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { Camera, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/constants/colors';

interface PhotoPickerProps {
  label: string;
  value?: string;
  onChange: (value: string | undefined) => void;
}

export function PhotoPicker({ label, value, onChange }: PhotoPickerProps) {
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        onChange(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleRemove = () => {
    onChange(undefined);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {value ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: value }} style={styles.image} />
          <TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
            <X size={20} color={colors.common.white} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Camera size={24} color={colors.text.secondary} strokeWidth={2} />
          <Text style={styles.buttonText}>Wybierz zdjęcie</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: colors.text.secondary,
    marginBottom: 8,
  },
  button: {
    backgroundColor: colors.common.background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.common.border,
    borderStyle: 'dashed',
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: colors.text.secondary,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    aspectRatio: 3/4,
    borderRadius: 12,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.common.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
});