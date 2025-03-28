import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { X, Calendar } from 'lucide-react-native';
import { Modal } from './Modal';
import { PhotoPicker } from './PhotoPicker';
import { colors } from '@/constants/colors';

interface MeasurementFormProps {
  onClose: () => void;
  onSubmit: (data: {
    date: string;
    weight: number;
    shoulders: number;
    chest: number;
    biceps: number;
    forearm: number;
    waist: number;
    abdomen: number;
    thigh: number;
    calf: number;
    photos: {
      front?: string;
      side?: string;
      back?: string;
    };
  }) => void;
  initialData?: {
    id?: string;
    date: string;
    weight: number;
    shoulders: number;
    chest: number;
    biceps: number;
    forearm: number;
    waist: number;
    abdomen: number;
    thigh: number;
    calf: number;
    photos: {
      front?: string;
      side?: string;
      back?: string;
    };
  };
}

export function MeasurementForm({ onClose, onSubmit, initialData }: MeasurementFormProps) {
  const [date, setDate] = useState<Date>(
    initialData ? new Date(initialData.date) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [measurements, setMeasurements] = useState({
    weight: initialData?.weight?.toString() || '',
    shoulders: initialData?.shoulders?.toString() || '',
    chest: initialData?.chest?.toString() || '',
    biceps: initialData?.biceps?.toString() || '',
    forearm: initialData?.forearm?.toString() || '',
    waist: initialData?.waist?.toString() || '',
    abdomen: initialData?.abdomen?.toString() || '',
    thigh: initialData?.thigh?.toString() || '',
    calf: initialData?.calf?.toString() || '',
  });
  const [photos, setPhotos] = useState(initialData?.photos || {});

  const formatDate = (date: Date) => {
    try {
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      return date.toLocaleDateString('pl-PL', options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const handleDateChange = (selectedDate: Date | null) => {
    if (selectedDate) {
      setDate(new Date(selectedDate));
      setShowDatePicker(false);
    }
  };

  const handleSubmit = () => {
    onSubmit({
      date: date.toISOString(),
      weight: parseFloat(measurements.weight) || 0,
      shoulders: parseFloat(measurements.shoulders) || 0,
      chest: parseFloat(measurements.chest) || 0,
      biceps: parseFloat(measurements.biceps) || 0,
      forearm: parseFloat(measurements.forearm) || 0,
      waist: parseFloat(measurements.waist) || 0,
      abdomen: parseFloat(measurements.abdomen) || 0,
      thigh: parseFloat(measurements.thigh) || 0,
      calf: parseFloat(measurements.calf) || 0,
      photos,
    });
  };

  const renderMeasurementInput = (
    label: string,
    key: keyof typeof measurements,
    unit: string = 'cm'
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label} ({unit})</Text>
      <TextInput
        style={styles.input}
        value={measurements[key]}
        onChangeText={(value) =>
          setMeasurements((prev) => ({ ...prev, [key]: value }))
        }
        keyboardType="numeric"
        placeholder="0"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {initialData ? 'Edytuj pomiary' : 'Nowe pomiary'}
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <View style={styles.dateButtonContent}>
            <Calendar size={20} color="#0d6efd" />
            <Text style={styles.dateButtonText}>
              {formatDate(date)}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pomiary</Text>
          {renderMeasurementInput('Waga', 'weight', 'kg')}
          {renderMeasurementInput('Barki', 'shoulders')}
          {renderMeasurementInput('Klatka piersiowa', 'chest')}
          {renderMeasurementInput('Biceps', 'biceps')}
          {renderMeasurementInput('Przedramię', 'forearm')}
          {renderMeasurementInput('Brzuch', 'abdomen')}
          {renderMeasurementInput('Talia', 'waist')}
          {renderMeasurementInput('Udo', 'thigh')}
          {renderMeasurementInput('Łydka', 'calf')}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Zdjęcia</Text>
          <View style={styles.photosContainer}>
            <PhotoPicker
              label="Przód"
              value={photos.front}
              onChange={(uri) => setPhotos(prev => ({ ...prev, front: uri }))}
            />
            <PhotoPicker
              label="Bok"
              value={photos.side}
              onChange={(uri) => setPhotos(prev => ({ ...prev, side: uri }))}
            />
            <PhotoPicker
              label="Tył"
              value={photos.back}
              onChange={(uri) => setPhotos(prev => ({ ...prev, back: uri }))}
            />
          </View>
        </View>
      </ScrollView>

      <Modal visible={showDatePicker} onClose={() => setShowDatePicker(false)}>
        <View style={styles.calendarContainer}>
          <Text style={styles.calendarTitle}>Wybierz datę</Text>
          <CalendarPicker
            onDateChange={handleDateChange}
            selectedStartDate={date}
            maxDate={new Date()}
            weekdays={['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb']}
            months={[
              'Styczeń',
              'Luty',
              'Marzec',
              'Kwiecień',
              'Maj',
              'Czerwiec',
              'Lipiec',
              'Sierpień',
              'Wrzesień',
              'Październik',
              'Listopad',
              'Grudzień',
            ]}
            previousTitle="Poprzedni"
            nextTitle="Następny"
            selectedDayColor="#0d6efd"
            selectedDayTextColor="#fff"
            todayBackgroundColor="#f0f0f0"
            textStyle={{
              fontFamily: 'Roboto-Regular',
              color: '#000',
            }}
          />
        </View>
      </Modal>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>
            {initialData ? 'Zapisz zmiany' : 'Dodaj pomiary'}
          </Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  dateButton: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  dateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateButtonText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#0d6efd',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  photosContainer: {
    gap: 16,
  },
  calendarContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
  },
  calendarTitle: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  submitButton: {
    backgroundColor: '#0d6efd',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
});