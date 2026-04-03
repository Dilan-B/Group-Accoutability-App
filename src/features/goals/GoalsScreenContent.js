import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Button, SegmentedButtons, Text, TextInput } from 'react-native-paper';

import { useAuthStore } from '../auth/authStore';
import { useSquadStore } from '../squads/squadStore';
import { useGoalsStore } from './goalsStore';

function GoalForm({ onSubmit, submitLabel, defaults, loading }) {
  const { control, handleSubmit } = useForm({
    defaultValues: defaults,
  });

  return (
    <View style={styles.card}>
      <Controller
        control={control}
        name="title"
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <TextInput mode="outlined" label="Goal Title" value={value} onChangeText={onChange} />
        )}
      />
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <TextInput mode="outlined" label="Description" value={value} onChangeText={onChange} />
        )}
      />
      <Controller
        control={control}
        name="frequency"
        render={({ field: { onChange, value } }) => (
          <SegmentedButtons
            value={value}
            onValueChange={onChange}
            buttons={[
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' },
            ]}
          />
        )}
      />
      <Controller
        control={control}
        name="target_value"
        render={({ field: { onChange, value } }) => (
          <TextInput
            mode="outlined"
            label="Target Value (Optional)"
            value={value}
            onChangeText={onChange}
            keyboardType="numeric"
          />
        )}
      />
      <Controller
        control={control}
        name="target_unit"
        render={({ field: { onChange, value } }) => (
          <TextInput mode="outlined" label="Target Unit (Optional)" value={value} onChangeText={onChange} />
        )}
      />

      <Button mode="contained" onPress={handleSubmit(onSubmit)} loading={loading}>
        {submitLabel}
      </Button>
    </View>
  );
}

function CheckinForm({ onSubmit, loading }) {
  const { control, handleSubmit, reset } = useForm({ defaultValues: { note: '', numeric_progress: '' } });

  return (
    <View style={styles.inlineCard}>
      <Controller
        control={control}
        name="note"
        render={({ field: { onChange, value } }) => (
          <TextInput mode="outlined" label="Note (Optional)" value={value} onChangeText={onChange} />
        )}
      />
      <Controller
        control={control}
        name="numeric_progress"
        render={({ field: { onChange, value } }) => (
          <TextInput
            mode="outlined"
            label="Numeric Progress (Optional)"
            value={value}
            onChangeText={onChange}
            keyboardType="numeric"
          />
        )}
      />
      <Button
        mode="contained-tonal"
        loading={loading}
        onPress={handleSubmit((values) => {
          onSubmit(values);
          reset();
        })}
      >
        Check-in Complete
      </Button>
    </View>
  );
}

export function GoalsScreenContent() {
  const user = useAuthStore((state) => state.user);
  const selectedSquadId = useSquadStore((state) => state.selectedSquadId);

  const goals = useGoalsStore((state) => state.goals);
  const loading = useGoalsStore((state) => state.loading);
  const error = useGoalsStore((state) => state.error);
  const loadGoals = useGoalsStore((state) => state.loadGoals);
  const addGoal = useGoalsStore((state) => state.addGoal);
  const editGoal = useGoalsStore((state) => state.editGoal);
  const pauseGoal = useGoalsStore((state) => state.pauseGoal);
  const reactivateGoal = useGoalsStore((state) => state.reactivateGoal);
  const checkInGoal = useGoalsStore((state) => state.checkInGoal);

  const [editingGoalId, setEditingGoalId] = useState('');

  useEffect(() => {
    if (!selectedSquadId || !user?.uid) {
      return;
    }

    loadGoals({ squadId: selectedSquadId, uid: user.uid });
  }, [loadGoals, selectedSquadId, user?.uid]);

  const editingGoal = useMemo(() => goals.find((goal) => goal.id === editingGoalId) || null, [goals, editingGoalId]);

  if (!selectedSquadId) {
    return (
      <View style={styles.centered}>
        <Text>Select a squad in the Squad tab before creating goals.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineSmall">Goals</Text>

      <GoalForm
        loading={loading}
        submitLabel={editingGoal ? 'Update Goal' : 'Create Goal'}
        defaults={{
          title: editingGoal?.title || '',
          description: editingGoal?.description || '',
          frequency: editingGoal?.frequency || 'daily',
          target_value: editingGoal?.target_value ? String(editingGoal.target_value) : '',
          target_unit: editingGoal?.target_unit || '',
        }}
        onSubmit={async (values) => {
          if (editingGoal) {
            await editGoal({ goalId: editingGoal.id, values, squadId: selectedSquadId, uid: user.uid });
            setEditingGoalId('');
            return;
          }

          await addGoal({ squadId: selectedSquadId, uid: user.uid, values });
        }}
      />

      {goals.length === 0 ? <Text>No goals yet for this squad.</Text> : null}

      {goals.map((goal) => (
        <View key={goal.id} style={styles.goalCard}>
          <Text variant="titleMedium">{goal.title}</Text>
          <Text>{goal.description || 'No description'}</Text>
          <Text>Frequency: {goal.frequency}</Text>
          <Text>Status: {goal.is_active ? 'Active' : 'Paused/Archived'}</Text>

          <View style={styles.row}>
            <Button mode="outlined" onPress={() => setEditingGoalId(goal.id)}>
              Edit
            </Button>
            {goal.is_active ? (
              <Button mode="outlined" onPress={() => pauseGoal({ goalId: goal.id, squadId: selectedSquadId, uid: user.uid })}>
                Pause
              </Button>
            ) : (
              <Button
                mode="outlined"
                onPress={() => reactivateGoal({ goalId: goal.id, squadId: selectedSquadId, uid: user.uid })}
              >
                Reactivate
              </Button>
            )}
          </View>

          <CheckinForm loading={loading} onSubmit={(input) => checkInGoal({ goal, squadId: selectedSquadId, uid: user.uid, input })} />
        </View>
      ))}

      {!!error && <Text style={styles.error}>{error}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    gap: 12,
    padding: 16,
  },
  centered: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    gap: 8,
  },
  inlineCard: {
    gap: 8,
    marginTop: 10,
  },
  goalCard: {
    borderColor: '#DDDDDD',
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  error: {
    color: '#B00020',
  },
});
