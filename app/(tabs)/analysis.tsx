import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  ImageBackground,
  Modal,
  TextInput,
} from 'react-native';

import { useMeasurementStore } from '@/stores/measurements';
import { useWorkoutStore } from '@/stores/workouts';
import {
  Scale,
  Dumbbell,
  Calendar as CalendarIcon,
  ChevronDown,
} from 'lucide-react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart, BarChart } from 'react-native-chart-kit';

/** 
 * Typy dla kategorii analizy
 *  'general'    -> Ogólne (BarChart z liczbą treningów w miesiącach wybranego roku)
 *  'measurements' -> Pomiary
 *  'exercises' -> Ćwiczenia
 */
type AnalysisType = 'general' | 'measurements' | 'exercises';

type MeasurementType =
  | 'weight'
  | 'shoulders'
  | 'chest'
  | 'biceps'
  | 'forearm'
  | 'abdomen'
  | 'waist'
  | 'thigh'
  | 'calf';

type ExerciseMetric = 'weight' | 'reps' | 'distance' | 'time';

// Nazwy i jednostki dla pomiarów
const measurementLabels: Record<MeasurementType, string> = {
  weight: 'Waga',
  shoulders: 'Barki',
  chest: 'Klatka',
  biceps: 'Biceps',
  forearm: 'Przedramię',
  abdomen: 'Brzuch',
  waist: 'Talia',
  thigh: 'Udo',
  calf: 'Łydka',
};

const measurementUnits: Record<MeasurementType, string> = {
  weight: 'kg',
  shoulders: 'cm',
  chest: 'cm',
  biceps: 'cm',
  forearm: 'cm',
  abdomen: 'cm',
  waist: 'cm',
  thigh: 'cm',
  calf: 'cm',
};

// Nazwy i jednostki dla ćwiczeń
const exerciseMetricLabels: Record<ExerciseMetric, string> = {
  weight: 'Ciężar',
  reps: 'Powtórzenia',
  distance: 'Dystans',
  time: 'Czas',
};

const exerciseMetricUnits: Record<ExerciseMetric, string> = {
  weight: 'kg',
  reps: 'powt.',
  distance: 'm',
  time: 'min',
};

// Nazwy miesięcy do wyświetlania w tabeli
const monthNames = [
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
];

/**
 * Funkcja tworząca tablicę stringów ["01", "02", ..., "12"] – 
 * używana jako etykiety słupków wykresu w sekcji "Ogólne".
 */
function getMonthLabelsAsNumbers() {
  const arr: string[] = [];
  for (let i = 1; i <= 12; i++) {
    arr.push(i.toString().padStart(2, '0')); // "01", "02", ... "12"
  }
  return arr;
}

export default function AnalysisScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const chartWidth = screenWidth - 40;
  const chartHeight = 220;

  // Kategoria w analizie
  const [analysisType, setAnalysisType] = useState<AnalysisType>('general');

  // Daty (kalendarz) – TYLKO w Pomiary/Ćwiczenia
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Wybór pomiaru
  const [showMeasurementModal, setShowMeasurementModal] = useState(false);
  const [selectedMeasurement, setSelectedMeasurement] =
    useState<MeasurementType>('weight');

  // Wybór ćwiczenia
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [searchExerciseQuery, setSearchExerciseQuery] = useState('');

  // Wybór metryki ćwiczeń
  const [showExerciseMetricModal, setShowExerciseMetricModal] = useState(false);
  const [selectedExerciseMetric, setSelectedExerciseMetric] =
    useState<ExerciseMetric>('weight');

  // Pobieramy dane ze store
  const { measurements } = useMeasurementStore();
  const { workouts } = useWorkoutStore();

  // Unikalne nazwy ćwiczeń
  const exercises = useMemo(() => {
    return Array.from(
      new Set(workouts.flatMap((w) => w.exercises.map((e) => e.name)))
    );
  }, [workouts]);

  // Filtr wyszukiwania
  const filteredExercises = useMemo(() => {
    const q = searchExerciseQuery.toLowerCase();
    return exercises.filter((name) => name.toLowerCase().includes(q));
  }, [exercises, searchExerciseQuery]);

  // Metryki
  const exerciseMetrics: ExerciseMetric[] = ['weight', 'reps', 'distance', 'time'];

  // Kalendarz – obsługa
  const handleDateChange = (date: Date, type: 'START_DATE' | 'END_DATE') => {
    if (analysisType === 'measurements' || analysisType === 'exercises') {
      if (type === 'START_DATE') {
        setStartDate(date);
        if (endDate && date > endDate) {
          setEndDate(date);
        }
      } else {
        setEndDate(date);
        if (!startDate) {
          setStartDate(date);
        }
      }
    }
  };

  // Formatowanie dat
  const formatShortDate = (date: Date) =>
    `${date.getDate()}.${date.getMonth() + 1}`;
  const formatFullDate = (dateInput: Date | null) =>
    dateInput
      ? new Date(dateInput).toLocaleDateString('pl-PL', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : '';

  // ============================================
  // DOSTĘPNE LATA w "Ogólne" (z workouts)
  // ============================================
  const availableYears = useMemo(() => {
    const yearsSet = new Set<number>();
    workouts.forEach((w) => {
      const y = new Date(w.date).getFullYear();
      yearsSet.add(y);
    });
    return Array.from(yearsSet).sort((a, b) => a - b);
  }, [workouts]);

  // Wybrany rok
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [showYearModal, setShowYearModal] = useState(false);

  // ======================================
  // POBIERANIE DANYCH - POMIARY
  // ======================================
  const getMeasurementData = (type: MeasurementType) => {
    let data = measurements
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((m) => ({
        date: new Date(m.date),
        value: m[type],
      }));
    // Tylko "pomiary" używają startDate/endDate
    if (analysisType === 'measurements' && startDate && endDate) {
      const endDatePlusOne = new Date(endDate);
      endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
      data = data.filter((d) => d.date >= startDate && d.date < endDatePlusOne);
    }
    return data;
  };

  // ======================================
  // POBIERANIE DANYCH - ĆWICZENIA
  // ======================================
  const getExerciseData = (exerciseName: string, metric: ExerciseMetric) => {
    let data = workouts
      .filter((w) => w.exercises.some((e) => e.name === exerciseName))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((w) => {
        const exercise = w.exercises.find((e) => e.name === exerciseName)!;
        let value = 0;
        switch (metric) {
          case 'weight':
            value = Math.max(...exercise.sets.map((s) => s.weight || 0));
            break;
          case 'reps':
            value = Math.max(...exercise.sets.map((s) => s.reps || 0));
            break;
          case 'distance':
            value = Math.max(...exercise.sets.map((s) => s.distance || 0));
            break;
          case 'time':
            // sekundy -> minuty
            value = Math.max(...exercise.sets.map((s) => (s.time || 0) / 60));
            break;
        }
        return { date: new Date(w.date), value };
      });

    // Tylko "exercises" używają startDate/endDate
    if (analysisType === 'exercises' && startDate && endDate) {
      const endDatePlusOne = new Date(endDate);
      endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
      data = data.filter((d) => d.date >= startDate && d.date < endDatePlusOne);
    }
    return data;
  };

  // ======================================
  // POBIERANIE DANYCH - OGÓLNE (wybrany rok)
  // ======================================
  const getGeneralYearData = (year: number) => {
    // Tablica 12 elementów (miesiące 0..11)
    const monthlyCounts = Array(12).fill(0);
    workouts.forEach((w) => {
      const d = new Date(w.date);
      const y = d.getFullYear();
      const m = d.getMonth(); // 0..11
      if (y === year) {
        monthlyCounts[m] += 1;
      }
    });
    return monthlyCounts;
  };

  // ========== TABELA - Tooltip Dla LineChart ==============
  const [tooltipPos, setTooltipPos] = useState({
    x: 0,
    y: 0,
    visible: false,
    value: null as number | null,
    date: null as Date | null,
  });

  // ======================================
  // RENDER "POMIARY"
  // ======================================
  const renderMeasurementSection = () => {
    const data = getMeasurementData(selectedMeasurement);
    if (!data || data.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>Brak danych do wyświetlenia</Text>
        </View>
      );
    }
    const label = measurementLabels[selectedMeasurement];
    const unit = measurementUnits[selectedMeasurement];

    // Etykiety i wartości
    const labels = data.map((d) => formatShortDate(d.date));
    const dataPoints = data.map((d) => d.value);

    return (
      <>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>
            {label} ({unit})
          </Text>

          <LineChart
            data={{
              labels,
              datasets: [{ data: dataPoints }],
            }}
            width={chartWidth}
            height={chartHeight}
            fromZero
            yAxisSuffix={unit}
            withDots
            withInnerLines
            withOuterLines
            withVerticalLabels
            chartConfig={{
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              color: (opacity = 1) => `rgba(13, 110, 253, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(102,102,102,${opacity})`,
              decimalPlaces: 0,
              propsForDots: {
                r: '5',
                strokeWidth: '2',
                stroke: '#fff',
              },
            }}
            bezier
            style={{ borderRadius: 12, marginVertical: 8 }}
            onDataPointClick={({ index, value, x, y }) => {
              const clickedDate = data[index].date;
              const isSamePoint = tooltipPos.x === x && tooltipPos.y === y;
              if (isSamePoint) {
                setTooltipPos((prev) => ({
                  ...prev,
                  visible: !prev.visible,
                }));
              } else {
                setTooltipPos({
                  x,
                  y,
                  value,
                  date: clickedDate,
                  visible: true,
                });
              }
            }}
            decorator={() => {
              if (tooltipPos.visible && tooltipPos.value !== null && tooltipPos.date) {
                return (
                  <View
                    style={{
                      position: 'absolute',
                      left: tooltipPos.x - 50,
                      top: tooltipPos.y - 70,
                      backgroundColor: '#fff',
                      padding: 8,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: '#ccc',
                    }}
                  >
                    <Text style={{ fontFamily: 'Roboto-Medium' }}>
                      {tooltipPos.value} {unit}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#666' }}>
                      {formatFullDate(tooltipPos.date)}
                    </Text>
                  </View>
                );
              }
              return null;
            }}
          />
        </View>

        {/* Tabela z danymi */}
        <View style={styles.dataContainer}>
          <Text style={styles.dataTitle}>Szczegóły danych:</Text>
          {data.map((item, idx) => (
            <View style={styles.dataRow} key={idx}>
              <Text style={styles.dataDate}>{formatFullDate(item.date)}</Text>
              <Text style={styles.dataValue}>
                {item.value} {unit}
              </Text>
            </View>
          ))}
        </View>
      </>
    );
  };

  // ======================================
  // RENDER "ĆWICZENIA"
  // ======================================
  const renderExerciseSection = () => {
    if (!selectedExercise) {
      return (
        <View style={styles.emptyState}>
          <Dumbbell size={48} color="#666" />
          <Text style={styles.emptyStateTitle}>Wybierz ćwiczenie</Text>
          <Text style={styles.emptyStateText}>
            Wybierz ćwiczenie z listy, aby wyświetlić wykres
          </Text>
        </View>
      );
    }
    const data = getExerciseData(selectedExercise, selectedExerciseMetric);
    if (!data || data.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>Brak danych do wyświetlenia</Text>
        </View>
      );
    }

    const metricLabel = exerciseMetricLabels[selectedExerciseMetric];
    const metricUnit = exerciseMetricUnits[selectedExerciseMetric];
    const labels = data.map((d) => formatShortDate(d.date));
    const dataPoints = data.map((d) => d.value);

    return (
      <>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>
            {selectedExercise} – {metricLabel} ({metricUnit})
          </Text>

          <LineChart
            data={{
              labels,
              datasets: [{ data: dataPoints }],
            }}
            width={chartWidth}
            height={chartHeight}
            fromZero
            yAxisSuffix={metricUnit}
            withDots
            withInnerLines
            withOuterLines
            withVerticalLabels
            chartConfig={{
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              color: (opacity = 1) => `rgba(13, 110, 253, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(102,102,102,${opacity})`,
              decimalPlaces: 0,
              propsForDots: {
                r: '5',
                strokeWidth: '2',
                stroke: '#fff',
              },
            }}
            bezier
            style={{ borderRadius: 12, marginVertical: 8 }}
            onDataPointClick={({ index, value, x, y }) => {
              const clickedDate = data[index].date;
              const isSamePoint = tooltipPos.x === x && tooltipPos.y === y;
              if (isSamePoint) {
                setTooltipPos((prev) => ({
                  ...prev,
                  visible: !prev.visible,
                }));
              } else {
                setTooltipPos({
                  x,
                  y,
                  value,
                  date: clickedDate,
                  visible: true,
                });
              }
            }}
            decorator={() => {
              if (tooltipPos.visible && tooltipPos.value != null && tooltipPos.date) {
                return (
                  <View
                    style={{
                      position: 'absolute',
                      left: tooltipPos.x - 50,
                      top: tooltipPos.y - 70,
                      backgroundColor: '#fff',
                      padding: 8,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: '#ccc',
                    }}
                  >
                    <Text style={{ fontFamily: 'Roboto-Medium' }}>
                      {tooltipPos.value} {metricUnit}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#666' }}>
                      {formatFullDate(tooltipPos.date)}
                    </Text>
                  </View>
                );
              }
              return null;
            }}
          />
        </View>

        {/* Tabelka */}
        <View style={styles.dataContainer}>
          <Text style={styles.dataTitle}>Szczegóły danych:</Text>
          {data.map((item, idx) => (
            <View style={styles.dataRow} key={idx}>
              <Text style={styles.dataDate}>{formatFullDate(item.date)}</Text>
              <Text style={styles.dataValue}>
                {item.value} {metricUnit}
              </Text>
            </View>
          ))}
        </View>
      </>
    );
  };

  // ======================================
  // RENDER "OGÓLNE" (BarChart)
  // ======================================
  const renderGeneralSection = () => {
    if (!selectedYear) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>Wybierz rok</Text>
          <Text style={styles.emptyStateText}>
            Brak danych do wyświetlenia. Wybierz rok, który Cię interesuje.
          </Text>
        </View>
      );
    }
    const monthlyCounts = getGeneralYearData(selectedYear); // 12 elementów
    const numericLabels = getMonthLabelsAsNumbers(); // ["01","02","03",...,"12"]
    // Sprawdzamy, czy istnieje jakaś liczba > 0
    const anyData = monthlyCounts.some((val) => val > 0);
    if (!anyData) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>
            Brak treningów w {selectedYear} roku.
          </Text>
        </View>
      );
    }

    return (
      <>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>
            Liczba treningów w {selectedYear}
          </Text>

          <BarChart
            data={{
              labels: numericLabels,         // skrócone etykiety "01","02",...,"12"
              datasets: [{ data: monthlyCounts }],
            }}
            width={chartWidth}
            height={chartHeight}
            fromZero
            showBarTops
            withInnerLines
            yAxisSuffix=" tr."
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              color: (opacity = 1) => `rgba(13, 110, 253, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(102,102,102,${opacity})`,
              barPercentage: 0.5,
            }}
            style={{ borderRadius: 12, marginVertical: 8 }}
          />
        </View>

        {/* Szczegóły danych – pełne nazwy miesięcy */}
        <View style={styles.dataContainer}>
          <Text style={styles.dataTitle}>Szczegóły danych:</Text>
          {monthNames.map((monthLabel, idx) => {
            const count = monthlyCounts[idx];
            return (
              <View style={styles.dataRow} key={idx}>
                <Text style={styles.dataDate}>{monthLabel}</Text>
                <Text style={styles.dataValue}>{count} treningów</Text>
              </View>
            );
          })}
        </View>
      </>
    );
  };

  // Render ekranu
  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop',
      }}
      style={styles.background}
    >
      <LinearGradient
        colors={[
          'rgba(255,255,255,0.95)',
          'rgba(255,255,255,0.85)',
          'rgba(255,255,255,0.95)',
        ]}
        style={styles.container}
      >
        <ScrollView style={styles.scrollView}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>Analiza</Text>
          </View>

          {/* Taby */}
          <View style={styles.tabs}>
            {/* 1) OGÓLNE */}
            <TouchableOpacity
              style={[styles.tab, analysisType === 'general' && styles.activeTab]}
              onPress={() => setAnalysisType('general')}
            >
              <CalendarIcon
                size={20}
                color={
                  analysisType === 'general'
                    ? colors.goals.primary
                    : colors.text.secondary
                }
                strokeWidth={2}
              />
              <Text
                style={[styles.tabText, analysisType === 'general' && styles.activeTabText]}
              >
                Ogólne
              </Text>
            </TouchableOpacity>

            {/* 2) POMIARY */}
            <TouchableOpacity
              style={[styles.tab, analysisType === 'measurements' && styles.activeTab]}
              onPress={() => setAnalysisType('measurements')}
            >
              <Scale
                size={20}
                color={
                  analysisType === 'measurements'
                    ? colors.measurements.primary
                    : colors.text.secondary
                }
                strokeWidth={2}
              />
              <Text
                style={[
                  styles.tabText,
                  analysisType === 'measurements' && styles.activeTabText,
                ]}
              >
                Pomiary
              </Text>
            </TouchableOpacity>

            {/* 3) ĆWICZENIA */}
            <TouchableOpacity
              style={[styles.tab, analysisType === 'exercises' && styles.activeTab]}
              onPress={() => setAnalysisType('exercises')}
            >
              <Dumbbell
                size={20}
                color={
                  analysisType === 'exercises'
                    ? colors.training.primary
                    : colors.text.secondary
                }
                strokeWidth={2}
              />
              <Text
                style={[
                  styles.tabText,
                  analysisType === 'exercises' && styles.activeTabText,
                ]}
              >
                Ćwiczenia
              </Text>
            </TouchableOpacity>
          </View>

          {/* 
            W sekcji "Ogólne" -> dropdown wyboru ROKU 
          */}
          {analysisType === 'general' && (
            <TouchableOpacity
              style={styles.dropdownSelector}
              onPress={() => setShowYearModal(true)}
            >
              <Text style={styles.dropdownSelectorText}>
                {selectedYear ? `Rok: ${selectedYear}` : 'Wybierz rok'}
              </Text>
              <ChevronDown size={20} color="#666" />
            </TouchableOpacity>
          )}

          {/**
           * W POMIARACH I ĆWICZENIACH -> KALENDARZ
           */}
          {analysisType !== 'general' && (
            <TouchableOpacity
              style={styles.dateSelector}
              onPress={() => setShowDatePicker(true)}
            >
              <CalendarIcon size={20} color="#666" strokeWidth={2} />
              <Text style={styles.dateSelectorText}>
                {startDate && endDate
                  ? `${formatFullDate(startDate)} - ${formatFullDate(endDate)}`
                  : 'Wybierz zakres dat'}
              </Text>
            </TouchableOpacity>
          )}

          {/* 
            Render odpowiednich sekcji 
          */}
          {analysisType === 'general' && renderGeneralSection()}

          {analysisType === 'measurements' && (
            <>
              <TouchableOpacity
                style={styles.dropdownSelector}
                onPress={() => setShowMeasurementModal(true)}
              >
                <Text style={styles.dropdownSelectorText}>
                  {measurementLabels[selectedMeasurement]}
                </Text>
                <ChevronDown size={20} color="#666" />
              </TouchableOpacity>
              {renderMeasurementSection()}
            </>
          )}

          {analysisType === 'exercises' && (
            <>
              <TouchableOpacity
                style={styles.dropdownSelector}
                onPress={() => {
                  setSearchExerciseQuery('');
                  setShowExerciseModal(true);
                }}
              >
                <Text style={styles.dropdownSelectorText}>
                  {selectedExercise || 'Wybierz ćwiczenie'}
                </Text>
                <ChevronDown size={20} color="#666" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dropdownSelector}
                onPress={() => setShowExerciseMetricModal(true)}
              >
                <Text style={styles.dropdownSelectorText}>
                  {exerciseMetricLabels[selectedExerciseMetric]}
                </Text>
                <ChevronDown size={20} color="#666" />
              </TouchableOpacity>

              {renderExerciseSection()}
            </>
          )}
        </ScrollView>

        {/* ================== MODALE ================== */}
        {/* Modal - Wybór roku (tylko dla "Ogólne") */}
        <Modal visible={showYearModal} transparent={false} animationType="slide">
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Wybierz rok</Text>

            <ScrollView style={styles.modalContent}>
              {availableYears.map((year) => (
                <TouchableOpacity
                  key={year}
                  style={styles.modalOption}
                  onPress={() => {
                    setSelectedYear(year);
                    setShowYearModal(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{year}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={[styles.closeModalButton, { width: '100%' }]}
              onPress={() => setShowYearModal(false)}
            >
              <Text style={styles.closeModalButtonText}>Zamknij</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Modal - Kalendarz (tylko measurements / exercises) */}
        <Modal visible={showDatePicker} transparent={false} animationType="slide">
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Wybierz zakres dat</Text>
            <CalendarPicker
              startFromMonday
              allowRangeSelection
              selectedStartDate={startDate}
              selectedEndDate={endDate}
              onDateChange={handleDateChange}
              maxDate={new Date()}
              weekdays={['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd']}
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

            <TouchableOpacity
              style={[styles.closeModalButton, { width: '100%' }]}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.closeModalButtonText}>Zamknij</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Modal - Wybór pomiaru */}
        <Modal
          visible={showMeasurementModal}
          transparent={false}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Wybierz pomiar</Text>

            <ScrollView style={styles.modalContent}>
              {Object.entries(measurementLabels).map(([key, label]) => (
                <TouchableOpacity
                  key={key}
                  style={styles.modalOption}
                  onPress={() => {
                    setSelectedMeasurement(key as MeasurementType);
                    setShowMeasurementModal(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={[styles.closeModalButton, { width: '100%' }]}
              onPress={() => setShowMeasurementModal(false)}
            >
              <Text style={styles.closeModalButtonText}>Zamknij</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Modal - Wybór ćwiczenia (z wyszukiwarką) */}
        <Modal
          visible={showExerciseModal}
          transparent={false}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Wybierz ćwiczenie</Text>

            <TextInput
              style={styles.searchInput}
              placeholder="Szukaj ćwiczenia..."
              placeholderTextColor="#aaa"
              value={searchExerciseQuery}
              onChangeText={setSearchExerciseQuery}
            />

            <ScrollView style={styles.modalContent}>
              {filteredExercises.map((exercise) => (
                <TouchableOpacity
                  key={exercise}
                  style={styles.modalOption}
                  onPress={() => {
                    setSelectedExercise(exercise);
                    setShowExerciseModal(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{exercise}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={[styles.closeModalButton, { width: '100%' }]}
              onPress={() => setShowExerciseModal(false)}
            >
              <Text style={styles.closeModalButtonText}>Zamknij</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Modal - Wybór metryki (ciężar, reps itd.) */}
        <Modal
          visible={showExerciseMetricModal}
          transparent={false}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Wybierz metrykę</Text>

            <ScrollView style={styles.modalContent}>
              {exerciseMetrics.map((metric) => (
                <TouchableOpacity
                  key={metric}
                  style={styles.modalOption}
                  onPress={() => {
                    setSelectedExerciseMetric(metric);
                    setShowExerciseMetricModal(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>
                    {exerciseMetricLabels[metric]}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={[styles.closeModalButton, { width: '100%' }]}
              onPress={() => setShowExerciseMetricModal(false)}
            >
              <Text style={styles.closeModalButtonText}>Zamknij</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </LinearGradient>
    </ImageBackground>
  );
}

// =========================
// STYLE
// =========================
const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Roboto-Bold',
    color: colors.training.primary,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  activeTab: {
    backgroundColor: '#e6f0ff',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: '#666',
  },
  activeTabText: {
    color: '#0d6efd',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    margin: 20,
    marginTop: 20,
    marginBottom: 0,
  },
  dateSelectorText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: '#666',
  },
  dropdownSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    margin: 20,
    marginTop: 20,
    marginBottom: 0,
  },
  dropdownSelectorText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: '#666',
  },

  chartContainer: {
    marginVertical: 24,
    marginHorizontal: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    marginBottom: 8,
  },

  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: '#666',
    textAlign: 'center',
  },

  dataContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
    marginHorizontal: 20,
    marginBottom: 24,
  },
  dataTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    marginBottom: 12,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
  },
  dataDate: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#333',
  },
  dataValue: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: '#333',
  },

  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalContent: {
    flex: 1,
  },
  modalOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalOptionText: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  closeModalButton: {
    backgroundColor: '#ccc',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  closeModalButtonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#333',
  },
  searchInput: {
    width: '100%',
    height: 48,
    backgroundColor: '#f3f3f3',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    marginBottom: 20,
    fontFamily: 'Roboto-Regular',
    color: '#333',
  },
});
