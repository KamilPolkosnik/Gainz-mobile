import { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ImageBackground, ActivityIndicator } from 'react-native';
import { Plus, Scale } from 'lucide-react-native';
import { useMeasurementStore } from '@/stores/measurements';
import { Modal } from '@/components/Modal';
import { MeasurementForm } from '@/components/MeasurementForm';
import { MeasurementDetails } from '@/components/MeasurementDetails';
import { colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useFocusEffect } from 'expo-router';

const ITEMS_PER_PAGE = 3;

export default function MeasurementsScreen() {
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedMeasurementId, setSelectedMeasurementId] = useState<string | null>(null);
  const { measurements, addMeasurement, updateMeasurement, getMeasurement } = useMeasurementStore();
  const [visibleMeasurements, setVisibleMeasurements] = useState<typeof measurements>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const listRef = useRef<FlatList>(null);

  // Reset visible measurements and scroll position when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setVisibleMeasurements(measurements.slice(0, ITEMS_PER_PAGE));
      // Scroll to top with animation
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, [measurements])
  );

  const handleSubmit = (data: any) => {
    if (selectedMeasurementId) {
      // If we have a selectedMeasurementId, we're editing
      updateMeasurement(selectedMeasurementId, data);
    } else {
      // Otherwise, we're adding a new measurement
      addMeasurement(data);
      // Reset visible measurements to show the new one
      setVisibleMeasurements(measurements.slice(0, ITEMS_PER_PAGE));
    }
    setShowForm(false);
    setSelectedMeasurementId(null);
  };

  const handleStartEdit = () => {
    setShowDetails(false);
    setTimeout(() => setShowForm(true), 300);
  };

  const loadMore = useCallback(async () => {
    if (isLoadingMore || visibleMeasurements.length >= measurements.length) return;

    setIsLoadingMore(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const nextMeasurements = measurements.slice(0, visibleMeasurements.length + ITEMS_PER_PAGE);
    setVisibleMeasurements(nextMeasurements);
    setIsLoadingMore(false);
  }, [isLoadingMore, visibleMeasurements.length, measurements]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('pl-PL', options);
  };

  const measurementRows = [
    { label: 'Waga', key: 'weight', unit: 'kg' },
    { label: 'Barki', key: 'shoulders', unit: 'cm' },
    { label: 'Klatka', key: 'chest', unit: 'cm' },
    { label: 'Biceps', key: 'biceps', unit: 'cm' },
    { label: 'Przedramię', key: 'forearm', unit: 'cm' },
    { label: 'Brzuch', key: 'abdomen', unit: 'cm' },
    { label: 'Talia', key: 'waist', unit: 'cm' },
    { label: 'Udo', key: 'thigh', unit: 'cm' },
    { label: 'Łydka', key: 'calf', unit: 'cm' },
  ];

  const renderMeasurement = ({ item: measurement }: { item: any }) => (
    <Animated.View entering={FadeIn.delay(200)}>
      <TouchableOpacity
        style={styles.measurementCard}
        onPress={() => {
          setSelectedMeasurementId(measurement.id);
          setShowDetails(true);
        }}
      >
        <View style={styles.measurementHeader}>
          <View style={styles.measurementIcon}>
            <Scale size={24} color={colors.measurements.primary} strokeWidth={2} />
          </View>
          <View style={styles.measurementInfo}>
            <Text style={styles.measurementDate}>
              {formatDate(measurement.date)}
            </Text>
          </View>
        </View>

        <View style={styles.measurementGrid}>
          {measurementRows.map((row) => (
            <View key={row.key} style={styles.measurementRow}>
              <Text style={styles.measurementLabel}>{row.label}</Text>
              <Text style={styles.measurementValue}>
                {measurement[row.key]} {row.unit}
              </Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;

    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator color={colors.measurements.primary} />
        <Text style={styles.loadingText}>Ładowanie...</Text>
      </View>
    );
  };

  const selectedMeasurement = selectedMeasurementId ? getMeasurement(selectedMeasurementId) : null;

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop' }}
      style={styles.background}
    >
      <LinearGradient
        colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)', 'rgba(255,255,255,0.95)']}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Pomiary</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setSelectedMeasurementId(null);
              setShowForm(true);
            }}
          >
            <Plus size={24} color="#fff" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <FlatList
          ref={listRef}
          data={visibleMeasurements}
          renderItem={renderMeasurement}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Scale size={48} color={colors.measurements.primary} strokeWidth={1.5} />
              <Text style={styles.emptyStateTitle}>
                Brak pomiarów
              </Text>
              <Text style={styles.emptyStateText}>
                Dodaj swój pierwszy pomiar, aby rozpocząć śledzenie postępów
              </Text>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={() => {
                  setSelectedMeasurementId(null);
                  setShowForm(true);
                }}
              >
                <Text style={styles.emptyStateButtonText}>Dodaj pomiar</Text>
              </TouchableOpacity>
            </View>
          }
        />

        <Modal visible={showForm} onClose={() => setShowForm(false)}>
          <MeasurementForm 
            onClose={() => setShowForm(false)} 
            onSubmit={handleSubmit}
            initialData={selectedMeasurement ? {
              id: selectedMeasurement.id,
              date: selectedMeasurement.date,
              weight: selectedMeasurement.weight,
              shoulders: selectedMeasurement.shoulders,
              chest: selectedMeasurement.chest,
              biceps: selectedMeasurement.biceps,
              forearm: selectedMeasurement.forearm,
              waist: selectedMeasurement.waist,
              abdomen: selectedMeasurement.abdomen,
              thigh: selectedMeasurement.thigh,
              calf: selectedMeasurement.calf,
              photos: selectedMeasurement.photos,
            } : undefined}
          />
        </Modal>

        <Modal visible={showDetails} onClose={() => setShowDetails(false)}>
          <MeasurementDetails
            measurementId={selectedMeasurementId}
            onClose={() => setShowDetails(false)}
            onEdit={handleStartEdit}
          />
        </Modal>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Roboto-Bold',
    color: colors.measurements.primary,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.measurements.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  list: {
    padding: 20,
  },
  measurementCard: {
    backgroundColor: colors.common.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.common.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  measurementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  measurementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.measurements.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  measurementInfo: {
    flex: 1,
  },
  measurementDate: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: colors.text.primary,
  },
  measurementGrid: {
    backgroundColor: colors.measurements.light,
    borderRadius: 12,
    padding: 16,
  },
  measurementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.measurements.card.border,
  },
  measurementLabel: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: colors.text.secondary,
  },
  measurementValue: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: colors.text.primary,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: colors.measurements.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  emptyStateButtonText: {
    color: colors.common.white,
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
  loadingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: colors.measurements.primary,
  },
});