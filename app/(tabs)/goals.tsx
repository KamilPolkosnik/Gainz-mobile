import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from 'react-native';
import { Plus, Target, ArrowLeft, Trash2, CreditCard as Edit } from 'lucide-react-native';
import { useGoalStore } from '@/stores/goals';
import { Modal } from '@/components/Modal';
import { GoalForm } from '@/components/GoalForm';
import { GoalProgressForm } from '@/components/GoalProgressForm';
import { colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { useFocusEffect } from 'expo-router';

const ITEMS_PER_PAGE = 3;

export default function GoalsScreen() {
  const [showForm, setShowForm] = useState(false);
  const [showProgressForm, setShowProgressForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  const { goals, addGoal, updateGoal, editGoal, deleteGoal, getGoal, checkDeadlines } = useGoalStore();

  // -------------------------------
  // STAN I LOGIKA WYSZUKIWANIA (filtrowanie po tytule)
  // -------------------------------
  const [searchQuery, setSearchQuery] = useState('');

  // Przefiltrowana lista wszystkich celów
  const filteredGoals = useMemo(() => {
    // Jeżeli brak wpisu w polu wyszukiwania, zwracamy wszystkie cele
    if (!searchQuery) return goals;

    // W przeciwnym razie – tylko cele zawierające w tytule fragment wpisany przez użytkownika
    return goals.filter((goal) =>
      goal.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [goals, searchQuery]);

  // -------------------------------
  // ROZDZIELENIE NA AKTYWNE / UKOŃCZONE
  // -------------------------------
  const allActiveGoals = useMemo(() => filteredGoals.filter((g) => !g.completed), [filteredGoals]);
  const allCompletedGoals = useMemo(() => filteredGoals.filter((g) => g.completed), [filteredGoals]);

  // -------------------------------
  // PAGINACJA
  // -------------------------------
  const [visibleActiveGoals, setVisibleActiveGoals] = useState<typeof goals>([]);
  const [visibleCompletedGoals, setVisibleCompletedGoals] = useState<typeof goals>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const activeListRef = useRef<FlatList>(null);
  const completedListRef = useRef<FlatList>(null);

  // Sprawdzaj terminy przy starcie i co minutę (funkcja istniała w Twoim kodzie)
  useEffect(() => {
    checkDeadlines();
    const interval = setInterval(checkDeadlines, 60000);
    return () => clearInterval(interval);
  }, [checkDeadlines]);

  // Po wejściu w ekran i przy zmianie tabów – reset wyświetlanych celów i scroll na górę
  useFocusEffect(
    useCallback(() => {
      if (activeTab === 'active') {
        setVisibleActiveGoals(allActiveGoals.slice(0, ITEMS_PER_PAGE));
        setTimeout(() => {
          activeListRef.current?.scrollToOffset({ offset: 0, animated: false });
        }, 0);
      } else {
        setVisibleCompletedGoals(allCompletedGoals.slice(0, ITEMS_PER_PAGE));
        setTimeout(() => {
          completedListRef.current?.scrollToOffset({ offset: 0, animated: false });
        }, 0);
      }
    }, [activeTab, allActiveGoals, allCompletedGoals])
  );

  useEffect(() => {
    if (activeTab === 'active') {
      setVisibleActiveGoals(allActiveGoals.slice(0, ITEMS_PER_PAGE));
      setTimeout(() => {
        activeListRef.current?.scrollToOffset({ offset: 0, animated: false });
      }, 0);
    } else {
      setVisibleCompletedGoals(allCompletedGoals.slice(0, ITEMS_PER_PAGE));
      setTimeout(() => {
        completedListRef.current?.scrollToOffset({ offset: 0, animated: false });
      }, 0);
    }
  }, [activeTab, allActiveGoals, allCompletedGoals]);

  // -------------------------------
  // DODAWANIE / EDYCJA CELU
  // -------------------------------
  const handleAddGoal = (data: any) => {
    if (selectedGoalId) {
      editGoal(selectedGoalId, data);
    } else {
      addGoal(data);
    }
    setShowForm(false);
    setSelectedGoalId(null);
    // Odśwież listy widoczne
    setVisibleActiveGoals(allActiveGoals.slice(0, ITEMS_PER_PAGE));
    setVisibleCompletedGoals(allCompletedGoals.slice(0, ITEMS_PER_PAGE));
  };

  // -------------------------------
  // AKTUALIZACJA POSTĘPU CELU
  // -------------------------------
  const handleUpdateProgress = (value: number) => {
    if (selectedGoalId) {
      updateGoal(selectedGoalId, value);
      setShowProgressForm(false);
      setShowDetails(false);
      // Odśwież listy
      setVisibleActiveGoals(allActiveGoals.slice(0, ITEMS_PER_PAGE));
      setVisibleCompletedGoals(allCompletedGoals.slice(0, ITEMS_PER_PAGE));
    }
  };

  // -------------------------------
  // USUWANIE CELU
  // -------------------------------
  const handleDeleteGoal = () => {
    if (selectedGoalId) {
      deleteGoal(selectedGoalId);
      setShowDeleteConfirmation(false);
      setShowDetails(false);
      setVisibleActiveGoals(allActiveGoals.slice(0, ITEMS_PER_PAGE));
      setVisibleCompletedGoals(allCompletedGoals.slice(0, ITEMS_PER_PAGE));
    }
  };

  // -------------------------------
  // ŁADOWANIE KOLEJNYCH STRON
  // -------------------------------
  const loadMore = useCallback(async () => {
    if (isLoadingMore) return;

    const currentGoals = activeTab === 'active' ? allActiveGoals : allCompletedGoals;
    const visibleGoals = activeTab === 'active' ? visibleActiveGoals : visibleCompletedGoals;

    if (visibleGoals.length >= currentGoals.length) return;

    setIsLoadingMore(true);
    // Symulacja opóźnienia
    await new Promise((resolve) => setTimeout(resolve, 500));

    const nextGoals = currentGoals.slice(0, visibleGoals.length + ITEMS_PER_PAGE);

    if (activeTab === 'active') {
      setVisibleActiveGoals(nextGoals);
    } else {
      setVisibleCompletedGoals(nextGoals);
    }

    setIsLoadingMore(false);
  }, [isLoadingMore, activeTab, allActiveGoals, allCompletedGoals, visibleActiveGoals, visibleCompletedGoals]);

  // -------------------------------
  // FORMATOWANIE DATY (zachowane do wyświetlania w UI)
  // -------------------------------
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleDateString('pl-PL', options);
  };

  // -------------------------------
  // RENDEROWANIE POJEDYNCZEGO CELU
  // -------------------------------
  const renderGoal = ({ item: goal }: { item: any }) => {
    const daysLeft = Math.ceil(
      (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    const isDeadlinePassed = daysLeft <= 0;

    return (
      <Animated.View entering={FadeIn.delay(200)}>
        <TouchableOpacity
          style={styles.goalCard}
          onPress={() => {
            setSelectedGoalId(goal.id);
            setShowDetails(true);
          }}
        >
          <View style={styles.goalHeader}>
            <View
              style={[
                styles.goalIcon,
                goal.failed && styles.goalIconFailed,
                goal.completed && !goal.failed && styles.goalIconCompleted,
              ]}
            >
              <Target
                size={24}
                color={
                  goal.failed
                    ? colors.common.error
                    : goal.completed
                    ? colors.common.success
                    : colors.goals.primary
                }
                strokeWidth={2}
              />
            </View>
            <View style={styles.goalInfo}>
              <Text style={styles.goalTitle}>{goal.title}</Text>
              {goal.description && <Text style={styles.goalDescription}>{goal.description}</Text>}
            </View>
          </View>

          <View style={styles.goalDetails}>
            <View style={styles.goalValue}>
              <Text style={styles.goalValueText}>
                Aktualnie: {goal.currentValue} {goal.unit}
              </Text>
              <Text style={styles.goalValueText}>
                Cel: {goal.targetValue} {goal.unit}
              </Text>
            </View>
          </View>

          <View style={styles.deadline}>
            {goal.completed ? (
              <Text
                style={[
                  styles.deadlineText,
                  goal.failed ? styles.failedText : styles.completedText,
                ]}
              >
                {goal.failed
                  ? 'Cel nie został osiągnięty w wyznaczonym czasie'
                  : 'Cel osiągnięty!'}
              </Text>
            ) : (
              <Text style={[styles.deadlineText, isDeadlinePassed && styles.deadlinePassedText]}>
                {isDeadlinePassed
                  ? `Termin minął ${Math.abs(daysLeft)} dni temu`
                  : `Pozostało ${daysLeft} dni (do ${formatDate(goal.deadline)})`}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Stopka listy
  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator color={colors.goals.primary} />
        <Text style={styles.loadingText}>Ładowanie...</Text>
      </View>
    );
  };

  // Wybrany cel (do edycji / szczegółów)
  const selectedGoal = selectedGoalId ? getGoal(selectedGoalId) : null;

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
        {/* Nagłówek */}
        <View style={styles.header}>
          <Text style={styles.title}>Cele</Text>

          {/* Pola wyszukiwarki i przycisk dodawania */}
          <View style={styles.searchAndAddWrapper}>
            {/* Wyszukiwarka */}
            <TextInput
              style={styles.searchInput}
              placeholder="Wyszukaj..."
              placeholderTextColor={colors.text.secondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            {/* Przycisk dodawania nowego celu */}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                setSelectedGoalId(null);
                setShowForm(true);
              }}
            >
              <Plus size={24} color="#fff" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Taby */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'active' && styles.activeTab]}
            onPress={() => setActiveTab('active')}
          >
            <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
              Aktywne
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
            onPress={() => setActiveTab('completed')}
          >
            <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
              Ukończone
            </Text>
          </TouchableOpacity>
        </View>

        {/* Lista celów */}
        <FlatList
          ref={activeTab === 'active' ? activeListRef : completedListRef}
          data={activeTab === 'active' ? visibleActiveGoals : visibleCompletedGoals}
          renderItem={renderGoal}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Target size={48} color={colors.goals.primary} strokeWidth={1.5} />
              <Text style={styles.emptyStateTitle}>
                {activeTab === 'active' ? 'Brak aktywnych celów' : 'Brak ukończonych celów'}
              </Text>
              <Text style={styles.emptyStateText}>
                {activeTab === 'active'
                  ? 'Dodaj swój pierwszy cel, aby rozpocząć śledzenie postępów'
                  : 'Ukończ swój pierwszy cel, aby zobaczyć go tutaj'}
              </Text>
              {activeTab === 'active' && (
                <TouchableOpacity
                  style={styles.emptyStateButton}
                  onPress={() => {
                    setSelectedGoalId(null);
                    setShowForm(true);
                  }}
                >
                  <Text style={styles.emptyStateButtonText}>Dodaj cel</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />

        {/* Modal – Formularz nowego / edycji celu */}
        <Modal visible={showForm} onClose={() => setShowForm(false)}>
          <GoalForm
            onClose={() => setShowForm(false)}
            onSubmit={handleAddGoal}
            initialData={selectedGoalId ? getGoal(selectedGoalId) : undefined}
          />
        </Modal>

        {/* Modal – Szczegóły celu */}
        <Modal visible={showDetails} onClose={() => setShowDetails(false)}>
          {selectedGoal && (
            <View style={styles.detailsContainer}>
              <View style={styles.detailsHeader}>
                <TouchableOpacity onPress={() => setShowDetails(false)}>
                  <ArrowLeft size={24} color={colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.detailsTitle}>Szczegóły celu</Text>
                <View style={styles.detailsActions}>
                  {!selectedGoal.completed && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => {
                        setShowDetails(false);
                        setTimeout(() => setShowForm(true), 300);
                      }}
                    >
                      <Edit size={20} color={colors.goals.primary} />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setShowDeleteConfirmation(true)}
                  >
                    <Trash2 size={20} color={colors.common.error} />
                  </TouchableOpacity>
                </View>
              </View>

              <ScrollView style={styles.detailsContent}>
                <Text style={styles.detailsGoalTitle}>{selectedGoal.title}</Text>
                {selectedGoal.description && (
                  <Text style={styles.detailsDescription}>{selectedGoal.description}</Text>
                )}

                <View style={styles.detailsCard}>
                  <View style={styles.detailsRow}>
                    <Text style={styles.detailsLabel}>Obecna wartość</Text>
                    <Text style={styles.detailsValue}>
                      {selectedGoal.currentValue} {selectedGoal.unit}
                    </Text>
                  </View>
                  <View style={styles.detailsRow}>
                    <Text style={styles.detailsLabel}>Cel</Text>
                    <Text style={styles.detailsValue}>
                      {selectedGoal.targetValue} {selectedGoal.unit}
                    </Text>
                  </View>
                  <View style={styles.detailsRow}>
                    <Text style={styles.detailsLabel}>Termin</Text>
                    <Text style={styles.detailsValue}>{formatDate(selectedGoal.deadline)}</Text>
                  </View>
                  {selectedGoal.completed && (
                    <View style={styles.detailsRow}>
                      <Text style={styles.detailsLabel}>Status</Text>
                      <Text
                        style={[
                          styles.detailsValue,
                          selectedGoal.failed ? styles.failedText : styles.completedText,
                        ]}
                      >
                        {selectedGoal.failed ? 'Nie osiągnięty' : 'Osiągnięty'}
                      </Text>
                    </View>
                  )}
                </View>

                <Text style={styles.historyTitle}>Historia zmian</Text>
                <View style={styles.historyList}>
                  {selectedGoal.history.map((entry) => (
                    <View key={entry.id} style={styles.historyItem}>
                      <Text style={styles.historyValue}>
                        {entry.value} {selectedGoal.unit}
                      </Text>
                      <Text style={styles.historyDate}>{formatDate(entry.date)}</Text>
                    </View>
                  ))}
                </View>

                {!selectedGoal.completed && (
                  <TouchableOpacity
                    style={styles.updateButton}
                    onPress={() => setShowProgressForm(true)}
                  >
                    <Text style={styles.updateButtonText}>Aktualizuj postęp</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>
          )}
        </Modal>

        {/* Modal – Formularz aktualizacji postępu */}
        <Modal visible={showProgressForm} onClose={() => setShowProgressForm(false)}>
          {selectedGoal && (
            <GoalProgressForm
              onClose={() => setShowProgressForm(false)}
              onSubmit={handleUpdateProgress}
              goal={selectedGoal}
            />
          )}
        </Modal>

        {/* Dialog potwierdzenia usunięcia */}
        <ConfirmationDialog
          visible={showDeleteConfirmation}
          onClose={() => setShowDeleteConfirmation(false)}
          onConfirm={handleDeleteGoal}
          title="Usuń cel"
          message={
            selectedGoal?.completed
              ? 'Czy na pewno chcesz usunąć ten ukończony cel? Tej operacji nie można cofnąć.'
              : 'Czy na pewno chcesz usunąć ten cel? Tej operacji nie można cofnąć.'
          }
        />
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
    // Tytuł i obszar wyszukiwania + plus obok
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Roboto-Bold',
    color: colors.goals.primary,
  },
  searchAndAddWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    // Możesz tu dodać styl dla lepszego rozkładu
  },
  searchInput: {
    width: 180,
    height: 48,
    paddingHorizontal: 12,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: colors.common.background,
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: colors.text.primary,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.goals.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  tab: {
    flex: 1,
    backgroundColor: colors.common.background,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: colors.goals.light,
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: colors.text.secondary,
  },
  activeTabText: {
    color: colors.goals.primary,
  },
  list: {
    padding: 20,
  },
  goalCard: {
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
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  goalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.goals.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  goalIconFailed: {
    backgroundColor: '#ffebee', // czerwonawe tło
  },
  goalIconCompleted: {
    backgroundColor: '#e8f5e9', // zielonkawe tło
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: colors.text.secondary,
  },
  goalDetails: {
    backgroundColor: colors.goals.light,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  goalValue: {
    marginBottom: 8,
  },
  goalValueText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: colors.text.primary,
  },
  deadline: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.goals.card.border,
  },
  deadlineText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: colors.text.secondary,
  },
  deadlinePassedText: {
    color: colors.common.error,
  },
  completedText: {
    color: colors.common.success,
    fontFamily: 'Roboto-Medium',
  },
  failedText: {
    color: colors.common.error,
    fontFamily: 'Roboto-Medium',
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
    backgroundColor: colors.goals.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  emptyStateButtonText: {
    color: colors.common.white,
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.common.border,
  },
  detailsTitle: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: colors.text.primary,
  },
  detailsActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.common.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsContent: {
    flex: 1,
    padding: 20,
  },
  detailsGoalTitle: {
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  detailsDescription: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: colors.text.secondary,
    marginBottom: 24,
  },
  detailsCard: {
    backgroundColor: colors.goals.light,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.goals.card.border,
  },
  detailsLabel: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: colors.text.secondary,
  },
  detailsValue: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: colors.text.primary,
  },
  historyTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  historyList: {
    gap: 12,
    paddingBottom: 24,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.goals.light,
    padding: 12,
    borderRadius: 8,
  },
  historyValue: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: colors.text.primary,
  },
  historyDate: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: colors.text.secondary,
  },
  updateButton: {
    backgroundColor: colors.goals.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  updateButtonText: {
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
    color: colors.goals.primary,
  },
});
