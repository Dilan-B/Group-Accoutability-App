import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Button, Divider, Text, TextInput } from 'react-native-paper';

import { useAuthStore } from '../auth/authStore';
import { useSquadStore } from '../squads/squadStore';
import { useGoalsStore } from './goalsStore';
import { buildGoalFormDefaults } from './goalsUtils';

function CheckinForm({ onSubmit, loading }) {
  const { control, handleSubmit, reset } = useForm({ defaultValues: { note: '', progress_update: '' } });

  return (
    <View style={styles.checkinCard}>
      <Controller
        control={control}
        name="note"
        render={({ field: { onChange, value } }) => (
          <TextInput mode="outlined" label="Note (Optional)" value={value} onChangeText={onChange} />
        )}
      />
      <Controller
        control={control}
        name="progress_update"
        render={({ field: { onChange, value } }) => (
          <TextInput
            mode="outlined"
            label="Progress Update (Optional)"
            value={value}
            onChangeText={onChange}
            placeholder="I worked on this / made progress / completed today"
          />
        )}
      />
      <Button
        mode="contained-tonal"
        loading={loading}
        onPress={handleSubmit((values) => {
          onSubmit(values);
          reset({ note: '', progress_update: '' });
        })}
      >
        Log Check-in
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

  const { control, handleSubmit, reset } = useForm({
    defaultValues: buildGoalFormDefaults(null),
  });

  useEffect(() => {
    if (!selectedSquadId || !user?.uid) {
      return;
    }

    loadGoals({ squadId: selectedSquadId, uid: user.uid });
  }, [loadGoals, selectedSquadId, user?.uid]);

  const editingGoal = useMemo(() => goals.find((goal) => goal.id === editingGoalId) || null, [goals, editingGoalId]);

  useEffect(() => {
    reset(buildGoalFormDefaults(editingGoal));
  }, [editingGoal, reset]);

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

      <View style={styles.formCard}>
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
            <TextInput mode="outlined" label="Description (Optional)" value={value} onChangeText={onChange} multiline />
          )}
        />
        <Controller
          control={control}
          name="deadline"
          render={({ field: { onChange, value } }) => (
            <TextInput
              mode="outlined"
              label="Deadline (Optional)"
              value={value}
              onChangeText={onChange}
              placeholder="e.g. Friday or 2026-05-01"
            />
          )}
        />
        <Controller
          control={control}
          name="success_criteria"
          render={({ field: { onChange, value } }) => (
            <TextInput
              mode="outlined"
              label="What does done look like? (Optional)"
              value={value}
              onChangeText={onChange}
              multiline
            />
          )}
        />

        <Button
          mode="contained"
          loading={loading}
          onPress={handleSubmit(async (values) => {
            if (!user?.uid) {
              return;
            }

            if (editingGoal) {
              await editGoal({ goalId: editingGoal.id, values, squadId: selectedSquadId, uid: user.uid });
              setEditingGoalId('');
              return;
            }

            await addGoal({ squadId: selectedSquadId, uid: user.uid, values });
          })}
        >
          {editingGoal ? 'Update Goal' : 'Create Goal'}
        </Button>

        {editingGoal ? (
          <Button mode="outlined" onPress={() => setEditingGoalId('')}>
            Cancel Edit
          </Button>
        ) : null}
      </View>

      <Divider />

      {goals.length === 0 ? <Text>No goals yet for this squad.</Text> : null}

      {goals.map((goal) => (
        <View key={goal.id} style={styles.goalCard}>
          <Text variant="titleMedium">{goal.title}</Text>
          {!!goal.description ? <Text>{goal.description}</Text> : null}
          {!!goal.deadline ? <Text>Deadline: {goal.deadline}</Text> : null}
          {!!goal.success_criteria ? <Text>Done looks like: {goal.success_criteria}</Text> : null}
          <Text>Status: {goal.is_active ? 'Active' : 'Paused'}</Text>

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
    gap: 14,
    padding: 16,
  },
  centered: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formCard: {
    gap: 10,
  },
  goalCard: {
    borderColor: '#DDDDDD',
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 12,
  },
  checkinCard: {
    gap: 8,
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  error: {
    color: '#B00020',
  },
});
