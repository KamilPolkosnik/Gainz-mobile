import { useState, useCallback, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ImageBackground, ActivityIndicator } from 'react-native';
import { Plus, Scale, Calendar } from 'lucide-react-native';
import { useMeasurementStore } from '@/stores/measurements';
import { Modal } from '@/components/Modal';
import { MeasurementForm } from '@/components/MeasurementForm';
import { MeasurementDetails } from '@/components/MeasurementDetails';
import { colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useFocusEffect } from 'expo-router';
import CalendarPicker from 'react-native-calendar-picker';

const ITEMS_PER_PAGE = 3;

export default function MeasurementsScreen() {
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedMeasurementId, setSelectedMeasurementId] = useState<string | null>(null);

  const { measurements, addMeasurement, updateMeasurement, getMeasurement } = useMeasurementStore();

  // Stany do paginacji
  const [visibleMeasurements, setVisibleMeasurements] = useState<typeof measurements>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const listRef = useRef<FlatList>(null);

  // -------------------------------
  // STANY ORAZ LOGIKA FILTROWANIA
  // -------------------------------
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Funkcja do szybkiego filtrowania „Ostatni miesiąc”
  const handleFilterLastMonth = useCallback(() => {
    const now = new Date();
    const firstDayOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    setStartDate(firstDayOfThisMonth);
    setEndDate(now);
  }, []);

  // Obsługa wyboru zakresu dat w CalendarPicker
  const handleDateChange = useCallback((date: Date, type: 'START_DATE' | 'END_DATE') => {
    if (type === 'START_DATE') {
      setStartDate(date);
      setEndDate(null);
    } else {
      setEndDate(date);
    }
  }, []);

  // Filtrowanie pomiarów w zależności od wybranego zakresu
  const filteredMeasurements = useMemo(() => {
    if (!startDate || !endDate) {
      // Jeśli nie ma pełnego zakresu, zwracamy wszystkie
      return measurements;
    }
    return measurements.filter((m) => {
      const measurementDate = new Date(m.date);
      return measurementDate >= startDate && measurementDate <= endDate;
    });
  }, [measurements, startDate, endDate]);

  // Reset widocznych pomiarów i scroll, gdy wchodzimy ponownie na ekran
  useFocusEffect(
    useCallback(() => {
      setVisibleMeasurements(filteredMeasurements.slice(0, ITEMS_PER_PAGE));
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, [filteredMeasurements])
  );

  // Funkcja doładowująca kolejną porcję pomiarów
  const loadMore = useCallback(async () => {
    if (isLoadingMore || visibleMeasurements.length >= filteredMeasurements.length) return;

    setIsLoadingMore(true);

    // Symulacja opóźnienia
    await new Promise(resolve => setTimeout(resolve, 500));

    const nextMeasurements = filteredMeasurements.slice(0, visibleMeasurements.length + ITEMS_PER_PAGE);
    setVisibleMeasurements(nextMeasurements);
    setIsLoadingMore(false);
  }, [isLoadingMore, visibleMeasurements, filteredMeasurements]);

  // -------------------------------
  // DODAWANIE / EDYCJA POMIARÓW
  // -------------------------------
  const handleSubmit = (data: any) => {
    if (selectedMeasurementId) {
      // Edytujemy istniejący pomiar
      updateMeasurement(selectedMeasurementId, data);
    } else {
      // Dodajemy nowy pomiar
      addMeasurement(data);
    }

    // Zamknij formularz i zresetuj
    setShowForm(false);
    setSelectedMeasurementId(null);

    // Przewiń na górę listy
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const handleStartEdit = () => {
    setShowDetails(false);
    setTimeout(() => setShowForm(true), 300);
  };

  // -------------------------------
  // FORMATOWANIE DATY
  // -------------------------------
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
    };
    return date.toLocaleDateString('pl-PL', options);
  };

  // -------------------------------
  // RENDEROWANIE TABELKI Z WARTOŚCIAMI POMIARÓW
  // -------------------------------
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

  // -------------------------------
  // RENDER - POJEDYNCZY POMIAR
  // -------------------------------
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
            <Text style={styles.measurementDate}>{formatDate(measurement.date)}</Text>
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

  // Stopka ładowania
  const renderFooter = () => {
    if (!isLoadingMore) return null;

    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator color={colors.measurements.primary} />
        <Text style={styles.loadingText}>Ładowanie...</Text>
      </View>
    );
  };

  // Wybrany pomiar (do edycji / szczegółów)
  const selectedMeasurement = selectedMeasurementId ? getMeasurement(selectedMeasurementId) : null;

  // -------------------------------
  // RENDER GŁÓWNY
  // -------------------------------
  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop' }}
      style={styles.background}
    >
      <LinearGradient
        colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)', 'rgba(255,255,255,0.95)']}
        style={styles.container}
      >
        {/* Nagłówek */}
        <View style={styles.header}>
          <Text style={styles.title}>Pomiary</Text>

          {/* Kontener na przyciski: kalendarz, a potem dodawanie pomiaru */}
          <View style={styles.buttonsWrapper}>
            {/* 1) Przycisk kalendarza */}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setIsCalendarVisible(true)}
            >
              <Calendar size={24} color="#fff" strokeWidth={2} />
            </TouchableOpacity>

            {/* 2) Przycisk dodawania nowego pomiaru */}
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
        </View>

        {/* Lista pomiarów (z paginacją i filtrowaniem) */}
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
              <Text style={styles.emptyStateTitle}>Brak pomiarów</Text>
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

        {/* Modal - Formularz (dodawanie / edycja) */}
        <Modal visible={showForm} onClose={() => setShowForm(false)}>
          <MeasurementForm
            onClose={() => setShowForm(false)}
            onSubmit={handleSubmit}
            initialData={
              selectedMeasurement
                ? {
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
                  }
                : undefined
            }
          />
        </Modal>

        {/* Modal - Szczegóły */}
        <Modal visible={showDetails} onClose={() => setShowDetails(false)}>
          <MeasurementDetails
            measurementId={selectedMeasurementId}
            onClose={() => setShowDetails(false)}
            onEdit={handleStartEdit}
          />
        </Modal>

        {/* Modal - Kalendarz do filtrowania */}
        <Modal visible={isCalendarVisible} onClose={() => setIsCalendarVisible(false)}>
          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 18, fontFamily: 'Roboto-Bold', marginBottom: 20 }}>
              Wybierz zakres dat:
            </Text>
            <CalendarPicker
              allowRangeSelection
              onDateChange={handleDateChange}
              selectedStartDate={startDate}
              selectedEndDate={endDate}
              weekdays={['Ndz', 'Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob']}
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
              todayBackgroundColor={colors.measurements.light}
              selectedDayColor={colors.measurements.primary}
              selectedDayTextColor="#FFFFFF"
            />

            {/* Przycisk - "Ostatni miesiąc" */}
            <TouchableOpacity
              style={[styles.emptyStateButton, { marginTop: 20 }]}
              onPress={handleFilterLastMonth}
            >
              <Text style={styles.emptyStateButtonText}>Ostatni miesiąc</Text>
            </TouchableOpacity>

            {/* Przycisk - zamknięcia modala */}
            <TouchableOpacity
              style={[styles.emptyStateButton, { marginTop: 10 }]}
              onPress={() => setIsCalendarVisible(false)}
            >
              <Text style={styles.emptyStateButtonText}>Zamknij</Text>
            </TouchableOpacity>
          </View>
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
    // Rozkład: tytuł po lewej, przyciski po prawej
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
  // Kontener na przyciski w nagłówku
  buttonsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.measurements.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
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
