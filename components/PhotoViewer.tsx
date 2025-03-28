import { Modal, View, StyleSheet, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { X, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface Photo {
  id: string;
  uri: string;
  label: string;
}

interface PhotoViewerProps {
  photos: Photo[];
  selectedIndex: number | null;
  onClose: () => void;
}

export function PhotoViewer({ photos, selectedIndex, onClose }: PhotoViewerProps) {
  const { width: windowWidth } = useWindowDimensions();
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);

  const setSelectedPhoto = (index: number) => {
    translateX.value = withSpring(-index * windowWidth);
  };

  const handlePrevious = () => {
    if (selectedIndex === null || selectedIndex <= 0) return;
    setSelectedPhoto(selectedIndex - 1);
  };

  const handleNext = () => {
    if (selectedIndex === null || selectedIndex >= photos.length - 1) return;
    setSelectedPhoto(selectedIndex + 1);
  };

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      scale.value = withSpring(1);
    })
    .onChange((event) => {
      if (scale.value === 1) {
        translateX.value = event.translationX + (-selectedIndex! * windowWidth);
      }
    })
    .onEnd((event) => {
      if (scale.value !== 1) return;

      const threshold = windowWidth * 0.3;
      const velocity = event.velocityX;
      const currentIndex = selectedIndex!;

      let newIndex = currentIndex;

      if (Math.abs(event.translationX) > threshold || Math.abs(velocity) > 500) {
        if (event.translationX > 0 && currentIndex > 0) {
          newIndex = currentIndex - 1;
        } else if (event.translationX < 0 && currentIndex < photos.length - 1) {
          newIndex = currentIndex + 1;
        }
      }

      translateX.value = withSpring(-newIndex * windowWidth, {
        velocity: velocity,
        damping: 20,
      });
    });

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = Math.max(1, Math.min(event.scale * 1, 3));
    })
    .onEnd(() => {
      scale.value = withTiming(1);
    });

  const composed = Gesture.Simultaneous(panGesture, pinchGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: scale.value },
    ],
  }));

  if (selectedIndex === null) return null;

  return (
    <Modal
      visible={selectedIndex !== null}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.common.white} />
          </TouchableOpacity>
        </View>

        <GestureDetector gesture={composed}>
          <Animated.View style={[styles.photosContainer, animatedStyle]}>
            {photos.map((photo) => (
              <Image
                key={photo.id}
                source={{ uri: photo.uri }}
                style={[styles.fullscreenPhoto, { width: windowWidth }]}
                resizeMode="contain"
              />
            ))}
          </Animated.View>
        </GestureDetector>

        <View style={styles.navigation}>
          {selectedIndex > 0 && (
            <TouchableOpacity
              style={[styles.navButton, styles.prevButton]}
              onPress={handlePrevious}
            >
              <ChevronLeft size={32} color={colors.common.white} />
            </TouchableOpacity>
          )}
          {selectedIndex < photos.length - 1 && (
            <TouchableOpacity
              style={[styles.navButton, styles.nextButton]}
              onPress={handleNext}
            >
              <ChevronRight size={32} color={colors.common.white} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    padding: 20,
    paddingTop: 60,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photosContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  fullscreenPhoto: {
    height: '100%',
  },
  navigation: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prevButton: {
    marginRight: 'auto',
  },
  nextButton: {
    marginLeft: 'auto',
  },
});