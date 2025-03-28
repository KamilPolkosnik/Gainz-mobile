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

interface GoalFormProps {
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    currentValue: number;
    targetValue: number;
    unit: string;
    deadline: string;
  }) => void;
  initialData?: {
    title: string;
    description: string;
    currentValue: number;
    targetValue: number;
    unit: string;
    deadline: string;
  };
}

export function GoalForm({ onClose, onSubmit, initialData }: GoalFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [currentValue, setCurrentValue] = useState(initialData?.currentValue?.toString() || '0');
  const [targetValue, setTargetValue] = useState(initialData?.targetValue?.toString() || '');
  const [unit, setUnit] = useState(initialData?.unit || '');
  const [deadline, setDeadline] = useState<Date>(
    initialData ? new Date(initialData.deadline) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

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
      setDeadline(new Date(selectedDate));
      setShowDatePicker(false);
    }
  };

  const handleSubmit = () => {
    if (!title || !targetValue) {
      alert('Wypełnij wszystkie wymagane pola');
      return;
    }

    onSubmit({
      title,
      description,
      currentValue: parseFloat(currentValue) || 0,
      targetValue: parseFloat(targetValue),
      unit: unit || '',
      deadline: deadline.toISOString(),
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {initialData ? 'Edytuj cel' : 'Nowy cel'}
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nazwa celu *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="np. Zwiększenie wagi w wyciskaniu"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Opis</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Dodaj szczegóły swojego celu"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputContainer, { flex: 1 }]}>
            <Text style={styles.label}>Obecna wartość</Text>
            <TextInput
              style={styles.input}
              value={currentValue}
              onChangeText={setCurrentValue}
              keyboardType="numeric"
              placeholder="0"
            />
          </View>

          <View style={[styles.inputContainer, { flex: 1 }]}>
            <Text style={styles.label}>Cel *</Text>
            <TextInput
              style={styles.input}
              value={targetValue}
              onChangeText={setTargetValue}
              keyboardType="numeric"
              placeholder="np. 100"
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Jednostka</Text>
          <TextInput
            style={styles.input}
            value={unit}
            onChangeText={setUnit}
            placeholder="np. kg"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Termin realizacji</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <View style={styles.dateButtonContent}>
              <Calendar size={20} color="#0d6efd" />
              <Text style={styles.dateButtonText}>
                {formatDate(deadline)}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={showDatePicker} onClose={() => setShowDatePicker(false)}>
        <View style={styles.calendarContainer}>
          <Text style={styles.calendarTitle}>Wybierz datę</Text>
          <CalendarPicker
            onDateChange={handleDateChange}
            selectedStartDate={deadline}
            minDate={new Date()}
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
            {initialData ? 'Zapisz zmiany' : 'Dodaj cel'}
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
  inputContainer: {
    marginBottom: 20,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  dateButton: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  dateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateButtonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#0d6efd',
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