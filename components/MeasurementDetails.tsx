import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ArrowLeft, CreditCard as Edit2, Trash2 } from 'lucide-react-native';
import { useMeasurementStore } from '@/stores/measurements';
import { ConfirmationDialog } from './ConfirmationDialog';
import { PhotoGallery } from './PhotoGallery';
import { useState } from 'react';
import { colors } from '@/constants/colors';

interface MeasurementDetailsProps {
  measurementId: string | null;
  onClose: () => void;
  onEdit: () => void;
}

export function MeasurementDetails({ measurementId, onClose, onEdit }: MeasurementDetailsProps) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const { getMeasurement, deleteMeasurement } = useMeasurementStore();

  const measurement = measurementId ? getMeasurement(measurementId) : null;

  if (!measurement) {
    return null;
  }

  const handleDelete = () => {
    deleteMeasurement(measurement.id);
    setShowDeleteConfirmation(false);
    onClose();
  };

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

  const renderMeasurement = (label: string, value: number, unit: string = 'cm') => (
    <View style={styles.measurementRow}>
      <Text style={styles.measurementLabel}>{label}</Text>
      <Text style={styles.measurementValue}>{value} {unit}</Text>
    </View>
  );

  const photos = [
    ...(measurement.photos.front ? [{ id: `${measurement.id}-front`, uri: measurement.photos.front, label: 'Przód' }] : []),
    ...(measurement.photos.side ? [{ id: `${measurement.id}-side`, uri: measurement.photos.side, label: 'Bok' }] : []),
    ...(measurement.photos.back ? [{ id: `${measurement.id}-back`, uri: measurement.photos.back, label: 'Tył' }] : []),
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>
          Pomiary {formatDate(measurement.date)}
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={onEdit}
          >
            <Edit2 size={20} color="#0d6efd" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deleteButton} 
            onPress={() => setShowDeleteConfirmation(true)}
          >
            <Trash2 size={20} color="#dc3545" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Podstawowe</Text>
          <View style={styles.measurementsList}>
            {renderMeasurement('Waga', measurement.weight, 'kg')}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Wymiary</Text>
          <View style={styles.measurementsList}>
            {renderMeasurement('Barki', measurement.shoulders)}
            {renderMeasurement('Klatka piersiowa', measurement.chest)}
            {renderMeasurement('Biceps', measurement.biceps)}
            {renderMeasurement('Przedramię', measurement.forearm)}
            {renderMeasurement('Brzuch', measurement.abdomen)}
            {renderMeasurement('Talia', measurement.waist)}
            {renderMeasurement('Udo', measurement.thigh)}
            {renderMeasurement('Łydka', measurement.calf)}
          </View>
        </View>

        {photos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Zdjęcia</Text>
            <PhotoGallery photos={photos} />
          </View>
        )}
      </ScrollView>

      <ConfirmationDialog
        visible={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDelete}
        title="Usuń pomiary"
        message="Czy na pewno chcesz usunąć te pomiary? Tej operacji nie można cofnąć."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    marginBottom: 16,
  },
  measurementsList: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  measurementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  measurementLabel: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: '#666',
  },
  measurementValue: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
});