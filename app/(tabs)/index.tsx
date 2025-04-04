import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { useAuthStore } from '@/stores/auth';
import { router } from 'expo-router';
import { Settings, Dumbbell, Scale, Target, Plus } from 'lucide-react-native';
import { ActionButton } from '@/components/ActionButton';
import { SummaryCard } from '@/components/SummaryCard';
import { Modal } from '@/components/Modal';
import { WorkoutForm } from '@/components/WorkoutForm';
import { MeasurementForm } from '@/components/MeasurementForm';
import { GoalForm } from '@/components/GoalForm';
import { useWorkoutStore } from '@/stores/workouts';
import { useMeasurementStore } from '@/stores/measurements';
import { useGoalStore } from '@/stores/goals';
import { colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const [showWorkoutForm, setShowWorkoutForm] = useState(false);
  const [showMeasurementForm, setShowMeasurementForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);

  const user = useAuthStore((state) => state.user);

  // Dane z poszczególnych store'ów
  const { workouts, addWorkout } = useWorkoutStore();
  const { measurements, addMeasurement } = useMeasurementStore();
  const { goals, addGoal } = useGoalStore();

  // Ostatnie wpisy
  const latestWorkout = workouts[0];
  const latestMeasurement = measurements[0];
  const latestGoal = goals[0];

  // ===============================
  // Funkcja do formatowania dat
  // ===============================
  const formatDateFancy = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',    // np. 'poniedziałek'
      day: 'numeric',     // np. 2
      month: 'long',      // np. 'kwietnia'
      year: 'numeric',    // np. 2025
      hour: '2-digit',    // np. 12
      minute: '2-digit',  // np. 34
    };
    return date.toLocaleString('pl-PL', options);
  };

  // Funkcje obsługi
  const handleAddWorkout = (data: { date: string; exercises: any[] }) => {
    addWorkout(data);
    setShowWorkoutForm(false);
  };

  const handleAddMeasurement = (data: any) => {
    addMeasurement(data);
    setShowMeasurementForm(false);
  };

  const handleAddGoal = (data: any) => {
    addGoal(data);
    setShowGoalForm(false);
  };

  // Tabela do wyświetlenia pomiarów w sekcji „Ostatni pomiar”
  const measurementRows = [
    { label: 'Waga', value: latestMeasurement?.weight, unit: 'kg' },
    { label: 'Barki', value: latestMeasurement?.shoulders, unit: 'cm' },
    { label: 'Klatka', value: latestMeasurement?.chest, unit: 'cm' },
    { label: 'Biceps', value: latestMeasurement?.biceps, unit: 'cm' },
    { label: 'Przedramię', value: latestMeasurement?.forearm, unit: 'cm' },
    { label: 'Brzuch', value: latestMeasurement?.abdomen, unit: 'cm' },
    { label: 'Talia', value: latestMeasurement?.waist, unit: 'cm' },
    { label: 'Udo', value: latestMeasurement?.thigh, unit: 'cm' },
    { label: 'Łydka', value: latestMeasurement?.calf, unit: 'cm' },
  ];

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop',
      }}
      style={styles.background}
    >
      <LinearGradient
        colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)', 'rgba(255,255,255,0.95)']}
        style={styles.container}
      >
        <ScrollView style={styles.scrollView}>
          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcome}>
                Witaj, {user?.name || 'użytkowniku'}!
              </Text>
            </View>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => router.push('/settings')}
            >
              <Settings size={24} color={colors.training.primary} />
            </TouchableOpacity>
          </View>

          {/* PRZYCISKI AKCJI */}
          <View style={styles.actionButtons}>
            <ActionButton
              icon={Dumbbell}
              label="Dodaj trening"
              onPress={() => setShowWorkoutForm(true)}
              type="training"
            />
            <ActionButton
              icon={Scale}
              label="Dodaj pomiar"
              onPress={() => setShowMeasurementForm(true)}
              type="measurements"
            />
            <ActionButton
              icon={Target}
              label="Dodaj cel"
              onPress={() => setShowGoalForm(true)}
              type="goals"
            />
          </View>

          {/* KARTY PODSUMOWAŃ */}
          <View style={styles.summaries}>
            {/* OSTATNI TRENING */}
            <SummaryCard
              title="Ostatni trening"
              onAdd={() => setShowWorkoutForm(true)}
              onPress={() => router.push('/(tabs)/training')}
              type="training"
            >
              {latestWorkout ? (
                <View style={[styles.summaryContent, styles.trainingBackground]}>
                  <Text style={styles.summaryDate}>
                    {formatDateFancy(latestWorkout.date)}
                  </Text>

                  <View style={styles.exerciseList}>
                    {latestWorkout.exercises.map((exercise: any, exIndex: number) => (
                      <Text
                        key={`${exercise.id || exIndex}`}
                        style={styles.exerciseName}
                      >
                        • {exercise.name}
                      </Text>
                    ))}
                  </View>
                </View>
              ) : (
                // Pusty stan treningu
                <View style={[styles.emptyContainer, styles.trainingBackground]}>
                  <Text style={styles.emptyMessageBold}>Dodaj trening</Text>
                  <TouchableOpacity
                    style={styles.plusButton}
                    onPress={() => setShowWorkoutForm(true)}
                  >
                    <Plus size={24} color="#666" />
                  </TouchableOpacity>
                </View>
              )}
            </SummaryCard>

            {/* OSTATNI POMIAR */}
            <SummaryCard
              title="Ostatni pomiar"
              onAdd={() => setShowMeasurementForm(true)}
              onPress={() => router.push('/(tabs)/measurements')}
              type="measurements"
            >
              {latestMeasurement ? (
                <View style={[styles.summaryContent, styles.measurementsBackground]}>
                  <Text style={styles.summaryDate}>
                    {formatDateFancy(latestMeasurement.date)}
                  </Text>

                  <View style={styles.measurementGrid}>
                    {measurementRows.map((row) => (
                      <View key={row.label} style={styles.measurementGridItem}>
                        <Text style={styles.measurementLabel}>{row.label}</Text>
                        <Text style={styles.measurementValue}>
                          {row.value ? `${row.value} ${row.unit}` : '-'}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ) : (
                // Pusty stan pomiaru
                <View style={[styles.emptyContainer, styles.measurementsBackground]}>
                  <Text style={styles.emptyMessageBold}>Dodaj pomiar</Text>
                  <TouchableOpacity
                    style={styles.plusButton}
                    onPress={() => setShowMeasurementForm(true)}
                  >
                    <Plus size={24} color="#666" />
                  </TouchableOpacity>
                </View>
              )}
            </SummaryCard>

            {/* OSTATNI CEL */}
            <SummaryCard
              title="Ostatni cel"
              onAdd={() => setShowGoalForm(true)}
              onPress={() => router.push('/(tabs)/goals')}
              type="goals"
            >
              {latestGoal && !latestGoal.completed ? (
                <GoalSection latestGoal={latestGoal} />
              ) : (
                // Pusty stan celu
                <View style={[styles.emptyContainer, styles.goalsBackground]}>
                  <Text style={styles.emptyMessageBold}>Dodaj cel</Text>
                  <TouchableOpacity
                    style={styles.plusButton}
                    onPress={() => setShowGoalForm(true)}
                  >
                    <Plus size={24} color="#666" />
                  </TouchableOpacity>
                </View>
              )}
            </SummaryCard>
          </View>
        </ScrollView>

        {/* MODALE */}
        <Modal visible={showWorkoutForm} onClose={() => setShowWorkoutForm(false)}>
          <WorkoutForm
            onClose={() => setShowWorkoutForm(false)}
            onSubmit={handleAddWorkout}
          />
        </Modal>

        <Modal visible={showMeasurementForm} onClose={() => setShowMeasurementForm(false)}>
          <MeasurementForm
            onClose={() => setShowMeasurementForm(false)}
            onSubmit={handleAddMeasurement}
          />
        </Modal>

        <Modal visible={showGoalForm} onClose={() => setShowGoalForm(false)}>
          <GoalForm
            onClose={() => setShowGoalForm(false)}
            onSubmit={handleAddGoal}
          />
        </Modal>
      </LinearGradient>
    </ImageBackground>
  );
}

// ------------------------------
// SEKCJA CELU – Wyodrębniona
// ------------------------------
function GoalSection({ latestGoal }: { latestGoal: any }) {
  // Obliczamy, ile dni zostało do terminu realizacji
  const now = new Date();
  const deadlineDate = new Date(latestGoal.deadline);
  const timeDiff = deadlineDate.getTime() - now.getTime();
  const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  // Formatowanie daty
  const formatDateFancy = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleString('pl-PL', options);
  };

  return (
    <View style={[styles.summaryContent, styles.goalsBackground]}>
      <Text style={styles.goalTitle}>{latestGoal.title}</Text>

      <View style={styles.goalDetails}>
        <View style={styles.goalValue}>
          <Text style={styles.goalValueText}>
            Aktualnie: {latestGoal.currentValue} {latestGoal.unit}
          </Text>
          <Text style={styles.goalValueText}>
            Cel: {latestGoal.targetValue} {latestGoal.unit}
          </Text>
        </View>
        <Text style={styles.goalDeadline}>Termin realizacji:</Text>
        <Text style={styles.goalDeadlineTime}>
          {formatDateFancy(latestGoal.deadline)}
        </Text>

        {/* Wyświetlamy liczbę dni pozostałych do celu.
            Jeśli zostało <= 10 dni, tekst będzie czerwony */}
        <Text
          style={[
            styles.goalDaysLeft,
            daysLeft <= 10 && styles.goalDaysLeftDanger, // <--- tu warunkowe łączenie stylu
          ]}
        >
          {daysLeft > 0
            ? `Pozostało dni: ${daysLeft}`
            : daysLeft === 0
            ? 'To ostatni dzień na osiągnięcie celu!'
            : `Termin minął ${Math.abs(daysLeft)} dni temu`}
        </Text>
      </View>
    </View>
  );
}

// ------------------------------
// STYLE
// ------------------------------
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  welcomeContainer: {
    flex: 1,
  },
  welcome: {
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.training.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  summaries: {
    paddingHorizontal: 20,
  },
  summaryContent: {
    padding: 16,
    borderRadius: 12,
  },
  trainingBackground: {
    backgroundColor: colors.training.light,
  },
  measurementsBackground: {
    backgroundColor: colors.measurements.light,
  },
  goalsBackground: {
    backgroundColor: colors.goals.light,
  },
  summaryDate: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    marginBottom: 16,
  },
  exerciseList: {
    gap: 8,
  },
  exerciseName: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: colors.text.primary,
  },
  emptyContainer: {
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  emptyMessageBold: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 12,
  },
  plusButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  measurementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 12,
  },
  measurementGridItem: {
    width: '45%',
    padding: 12,
    borderRadius: 8,
  },
  measurementLabel: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: colors.text.secondary,
    marginBottom: 4,
  },
  measurementValue: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
  goalTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    marginBottom: 12,
  },
  goalDetails: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  goalValue: {
    marginBottom: 8,
  },
  goalValueText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    marginBottom: 4,
  },
  goalDeadline: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: colors.text.secondary,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.common.border,
  },
  goalDeadlineTime: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: colors.text.secondary,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.common.border,
    fontWeight: 'bold',
  },
  goalDaysLeft: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: colors.text.primary,
  },
  // Styl dla tekstu, jeśli zostało <= 10 dni
  goalDaysLeftDanger: {
    color: 'red',
  },
});
