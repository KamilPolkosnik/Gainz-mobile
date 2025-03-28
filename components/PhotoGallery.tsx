import { View, Text, StyleSheet, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { useState } from 'react';
import { PhotoViewer } from './PhotoViewer';
import { colors } from '@/constants/colors';

interface Photo {
  id: string;
  uri: string;
  label: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const { width } = useWindowDimensions();
  const photoWidth = Math.min(300, (width - 48) / 2);

  return (
    <>
      <View style={styles.grid}>
        {photos.map((photo, index) => (
          <View key={photo.id} style={styles.photoContainer}>
            <Text style={styles.photoLabel}>{photo.label}</Text>
            <TouchableOpacity
              style={[styles.photoWrapper, { width: photoWidth }]}
              onPress={() => setSelectedPhotoIndex(index)}
            >
              <Image 
                source={{ uri: photo.uri }} 
                style={styles.photo}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <PhotoViewer
        photos={photos}
        selectedIndex={selectedPhotoIndex}
        onClose={() => setSelectedPhotoIndex(null)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  photoContainer: {
    flex: 1,
    minWidth: 200,
    maxWidth: 300,
  },
  photoLabel: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: colors.text.secondary,
    marginBottom: 8,
  },
  photoWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    aspectRatio: 3/4,
  },
});