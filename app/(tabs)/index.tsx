import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { useAuthStore } from '@/stores/auth';
import { router } from 'expo-router';
import { Settings, Dumbbell, Scale, Target } from 'lucide-react-native';
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
  const { workouts, addWorkout } = useWorkoutStore();
  const { measurements, addMeasurement } = useMeasurementStore();
  const { goals, addGoal } = useGoalStore();

  const latestWorkout = workouts[0];
  const latestMeasurement = measurements[0];
  const latestGoal = goals[0];

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('pl-PL', options);
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
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcome}>Witaj, {user?.name || 'użytkowniku'}!</Text>
            </View>
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={() => router.push('/settings')}
            >
              <Settings size={24} color={colors.training.primary} />
            </TouchableOpacity>
          </View>

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

          <View style={styles.summaries}>
            <SummaryCard
              title="Ostatni trening"
              emptyMessage="Dodaj swój pierwszy trening"
              onAdd={() => setShowWorkoutForm(true)}
              onPress={() => router.push('/(tabs)/training')}
              type="training"
            >
              {latestWorkout && (
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryDate}>
                    {new Date(latestWorkout.date).toLocaleDateString('pl-PL')}
                  </Text>
                  <Text style={styles.summaryDetails}>
                    {latestWorkout.exercises.length} ćwiczeń
                  </Text>
                </View>
              )}
            </SummaryCard>

            <SummaryCard
              title="Ostatni pomiar"
              emptyMessage="Dodaj swój pierwszy pomiar"
              onAdd={() => setShowMeasurementForm(true)}
              onPress={() => router.push('/(tabs)/measurements')}
              type="measurements"
            >
              {latestMeasurement && (
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryDate}>
                    {new Date(latestMeasurement.date).toLocaleDateString('pl-PL')}
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
              )}
            </SummaryCard>

            <SummaryCard
              title="Ostatni cel"
              emptyMessage="Dodaj swój pierwszy cel"
              onAdd={() => setShowGoalForm(true)}
              onPress={() => router.push('/(tabs)/goals')}
              type="goals"
            >
              {latestGoal && (
                <View style={styles.summaryContent}>
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

                    <Text style={styles.goalDeadline}>
                      Do {new Date(latestGoal.deadline).toLocaleDateString('pl-PL')}
                    </Text>
                  </View>
                </View>
              )}
            </SummaryCard>
          </View>
        </ScrollView>

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
  },
  summaryDate: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    marginBottom: 16,
  },
  summaryDetails: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: colors.text.secondary,
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
});