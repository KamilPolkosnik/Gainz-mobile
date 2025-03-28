import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, ImageBackground } from 'react-native';
import Svg, { Path, Line, Text as SvgText, Circle } from 'react-native-svg';
import { useMeasurementStore } from '@/stores/measurements';
import { useWorkoutStore } from '@/stores/workouts';
import { Scale, Dumbbell, Calendar, ChevronDown } from 'lucide-react-native';
import { Modal } from '@/components/Modal';
import CalendarPicker from 'react-native-calendar-picker';
import { colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

type AnalysisType = 'measurements' | 'exercises';
type MeasurementType = 'weight' | 'shoulders' | 'chest' | 'biceps' | 'forearm' | 'abdomen' | 'waist' | 'thigh' | 'calf';
type ExerciseMetric = 'weight' | 'reps' | 'distance' | 'time';

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

export default function AnalysisScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const chartWidth = screenWidth - 40;
  const chartHeight = 220;
  const padding = { top: 20, right: 40, bottom: 40, left: 40 };

  const [analysisType, setAnalysisType] = useState<AnalysisType>('measurements');
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const { measurements } = useMeasurementStore();
  const { workouts } = useWorkoutStore();

  const exercises = Array.from(new Set(workouts.flatMap(w => w.exercises.map(e => e.name))));

  const formatDate = (date: Date) => {
    return `${date.getDate()}.${date.getMonth() + 1}`;
  };

  const formatFullDate = (dateInput: Date | null) => {
    if (!dateInput) return '';
    
    try {
      return new Date(dateInput).toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const getMeasurementData = (type: MeasurementType) => {
    let data = [...measurements]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(m => ({
        date: new Date(m.date),
        value: m[type],
      }));

    if (startDate && endDate) {
      const endDatePlusOne = new Date(endDate);
      endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
      
      data = data.filter(d => 
        d.date >= startDate && 
        d.date < endDatePlusOne
      );
    }

    return data;
  };

  const getExerciseData = (exerciseName: string, metric: ExerciseMetric) => {
    let data = workouts
      .filter(w => w.exercises.some(e => e.name === exerciseName))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(w => {
        const exercise = w.exercises.find(e => e.name === exerciseName)!;
        let value = 0;

        switch (metric) {
          case 'weight':
            value = Math.max(...exercise.sets.map(s => s.weight || 0));
            break;
          case 'reps':
            value = Math.max(...exercise.sets.map(s => s.reps || 0));
            break;
          case 'distance':
            value = Math.max(...exercise.sets.map(s => s.distance || 0));
            break;
          case 'time':
            value = Math.max(...exercise.sets.map(s => (s.time || 0) / 60));
            break;
        }

        return {
          date: new Date(w.date),
          value,
        };
      });

    if (startDate && endDate) {
      const endDatePlusOne = new Date(endDate);
      endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
      
      data = data.filter(d => 
        d.date >= startDate && 
        d.date < endDatePlusOne
      );
    }

    return data;
  };

  const handleDateChange = (date: Date, type: 'START_DATE' | 'END_DATE') => {
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
  };

  const renderChart = (data: { date: Date; value: number }[], unit: string, title: string) => {
    if (!data || data.length === 0) return null;

    const values = data.map(d => d.value || 0);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue || 1;

    const getX = (index: number): number => {
      if (data.length === 1) return chartWidth / 2;
      return padding.left + (index * (chartWidth - padding.left - padding.right) / Math.max(data.length - 1, 1));
    };

    const getY = (value: number): number => {
      const normalizedValue = ((value || 0) - minValue) / valueRange;
      return chartHeight - padding.bottom - (normalizedValue * (chartHeight - padding.top - padding.bottom));
    };

    const points = data.map((d, i) => ({
      x: getX(i),
      y: getY(d.value || 0),
    }));

    const pathD = points.length > 1 
      ? points.map((p, i) => 
          i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
        ).join(' ')
      : '';

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>{title}</Text>
        <View style={styles.chart}>
          <Svg width={chartWidth} height={chartHeight}>
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const y = padding.top + ratio * (chartHeight - padding.top - padding.bottom);
              const value = maxValue - (ratio * valueRange);
              return (
                <React.Fragment key={i}>
                  <Line
                    x1={padding.left}
                    y1={y}
                    x2={chartWidth - padding.right}
                    y2={y}
                    stroke="#eee"
                    strokeWidth="1"
                  />
                  <SvgText
                    x={padding.left - 5}
                    y={y}
                    textAnchor="end"
                    alignmentBaseline="middle"
                    fontSize="10"
                    fill="#666"
                  >
                    {Math.round(value)}
                  </SvgText>
                </React.Fragment>
              );
            })}

            {data.map((d, i) => (
              <SvgText
                key={i}
                x={getX(i)}
                y={chartHeight - padding.bottom + 20}
                textAnchor="middle"
                fontSize="10"
                fill="#666"
              >
                {formatDate(d.date)}
              </SvgText>
            ))}

            {points.length > 1 && (
              <Path
                d={pathD}
                stroke="#0d6efd"
                strokeWidth="2"
                fill="none"
              />
            )}

            {points.map((p, i) => (
              <React.Fragment key={i}>
                <Circle
                  cx={p.x.toString()}
                  cy={p.y.toString()}
                  r="4"
                  fill="#0d6efd"
                />
                <Circle
                  cx={p.x.toString()}
                  cy={p.y.toString()}
                  r="2"
                  fill="white"
                />
              </React.Fragment>
            ))}

            <SvgText
              x={padding.left - 25}
              y={padding.top - 5}
              textAnchor="start"
              fontSize="10"
              fill="#666"
            >
              {unit}
            </SvgText>
          </Svg>
        </View>
      </View>
    );
  };

  const renderMeasurementCharts = () => {
    return Object.entries(measurementLabels).map(([key, label]) => {
      const data = getMeasurementData(key as MeasurementType);
      if (data.length === 0) return null;

      return (
        <View key={`measurement-chart-${key}`}>
          {renderChart(
            data,
            measurementUnits[key as MeasurementType],
            label
          )}
        </View>
      );
    });
  };

  const renderExerciseCharts = () => {
    if (!selectedExercise) {
      return (
        <View style={styles.emptyState}>
          <Dumbbell size={48} color="#666" />
          <Text style={styles.emptyStateTitle}>Wybierz ćwiczenie</Text>
          <Text style={styles.emptyStateText}>
            Wybierz ćwiczenie z listy, aby zobaczyć analizę wszystkich parametrów
          </Text>
        </View>
      );
    }

    const metrics = {
      weight: workouts.some(w => 
        w.exercises.some(e => 
          e.name === selectedExercise && 
          e.sets.some(s => s.weight && s.weight > 0)
        )
      ),
      reps: workouts.some(w => 
        w.exercises.some(e => 
          e.name === selectedExercise && 
          e.sets.some(s => s.reps && s.reps > 0)
        )
      ),
      distance: workouts.some(w => 
        w.exercises.some(e => 
          e.name === selectedExercise && 
          e.sets.some(s => s.distance && s.distance > 0)
        )
      ),
      time: workouts.some(w => 
        w.exercises.some(e => 
          e.name === selectedExercise && 
          e.sets.some(s => s.time && s.time > 0)
        )
      ),
    };

    return (
      <View>
        {Object.entries(metrics).map(([metric, hasMetric]) => {
          if (!hasMetric) return null;

          const data = getExerciseData(selectedExercise, metric as ExerciseMetric);
          if (data.length === 0) return null;

          return renderChart(
            data,
            exerciseMetricUnits[metric as ExerciseMetric],
            exerciseMetricLabels[metric as ExerciseMetric]
          );
        })}
      </View>
    );
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop' }}
      style={styles.background}
    >
      <LinearGradient
        colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)', 'rgba(255,255,255,0.95)']}
        style={styles.container}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.title}>Analiza</Text>
          </View>

          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, analysisType === 'measurements' && styles.activeTab]}
              onPress={() => setAnalysisType('measurements')}
            >
              <Scale size={20} color={analysisType === 'measurements' ? colors.measurements.primary : colors.text.secondary} strokeWidth={2} />
              <Text style={[styles.tabText, analysisType === 'measurements' && styles.activeTabText]}>
                Pomiary
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, analysisType === 'exercises' && styles.activeTab]}
              onPress={() => setAnalysisType('exercises')}
            >
              <Dumbbell size={20} color={analysisType === 'exercises' ? colors.training.primary : colors.text.secondary} strokeWidth={2} />
              <Text style={[styles.tabText, analysisType === 'exercises' && styles.activeTabText]}>
                Ćwiczenia
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <TouchableOpacity
              style={styles.dateSelector}
              onPress={() => setShowDatePicker(true)}
            >
              <Calendar size={20} color="#666" strokeWidth={2} />
              <Text style={styles.dateSelectorText}>
                {startDate && endDate
                  ? `${formatFullDate(startDate)} - ${formatFullDate(endDate)}`
                  : 'Wybierz zakres dat'}
              </Text>
            </TouchableOpacity>

            {analysisType === 'exercises' && (
              <TouchableOpacity
                style={styles.exerciseSelector}
                onPress={() => setShowExercisePicker(true)}
              >
                <Text style={styles.exerciseSelectorText}>
                  {selectedExercise || 'Wybierz ćwiczenie'}
                </Text>
                <ChevronDown size={20} color="#666" />
              </TouchableOpacity>
            )}

            {analysisType === 'measurements' ? renderMeasurementCharts() : renderExerciseCharts()}
          </View>

          <Modal visible={showDatePicker} onClose={() => setShowDatePicker(false)}>
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Wybierz zakres dat</Text>
              </View>
              <CalendarPicker
                startFromMonday={true}
                allowRangeSelection={true}
                selectedStartDate={startDate}
                selectedEndDate={endDate}
                onDateChange={handleDateChange}
                maxDate={new Date()}
                weekdays={['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd']}
                months={[
                  'Styczeń', 'Luty', 'Marzec', 'Kwiecień',
                  'Maj', 'Czerwiec', 'Lipiec', 'Sierpień',
                  'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
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
                style={styles.applyButton}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.applyButtonText}>Zastosuj</Text>
              </TouchableOpacity>
            </View>
          </Modal>

          <Modal visible={showExercisePicker} onClose={() => setShowExercisePicker(false)}>
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Wybierz ćwiczenie</Text>
              </View>
              <ScrollView style={styles.exerciseList}>
                {exercises.map((exercise) => (
                  <TouchableOpacity
                    key={exercise}
                    style={styles.exerciseItem}
                    onPress={() => {
                      setSelectedExercise(exercise);
                      setShowExercisePicker(false);
                    }}
                  >
                    <Text style={styles.exerciseItemText}>{exercise}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </Modal>
        </ScrollView>
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
    padding: 20,
    gap: 12,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
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
  content: {
    padding: 20,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 20,
  },
  dateSelectorText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: '#666',
  },
  exerciseSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 20,
  },
  exerciseSelectorText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: '#666',
  },
  chartContainer: {
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    marginBottom: 12,
  },
  chart: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
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
  pickerContainer: {
    padding: 20,
  },
  pickerHeader: {
    marginBottom: 20,
  },
  pickerTitle: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
  },
  exerciseList: {
    maxHeight: 400,
  },
  exerciseItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  exerciseItemText: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  applyButton: {
    backgroundColor: '#0d6efd',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
});