import { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Button, Chip, Divider, Text, TextInput } from 'react-native-paper';

import { useAuthStore } from '../auth/authStore';
import { useSquadStore } from './squadStore';

export function SquadScreen() {
  const user = useAuthStore((state) => state.user);

  const squads = useSquadStore((state) => state.squads);
  const selectedSquadId = useSquadStore((state) => state.selectedSquadId);
  const members = useSquadStore((state) => state.members);
  const loading = useSquadStore((state) => state.loading);
  const error = useSquadStore((state) => state.error);
  const loadSquads = useSquadStore((state) => state.loadSquads);
  const createNewSquad = useSquadStore((state) => state.createNewSquad);
  const joinSquad = useSquadStore((state) => state.joinSquad);
  const selectSquad = useSquadStore((state) => state.selectSquad);

  const createForm = useForm({ defaultValues: { name: '' } });
  const joinForm = useForm({ defaultValues: { inviteCode: '' } });

  useEffect(() => {
    if (!user?.uid) {
      return;
    }

    loadSquads(user.uid);
  }, [loadSquads, user?.uid]);

  const selectedSquad = squads.find((item) => item.id === selectedSquadId) || null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineSmall">Squads</Text>

      <View style={styles.block}>
        <Text variant="titleMedium">Create Squad</Text>
        <Controller
          control={createForm.control}
          name="name"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <TextInput mode="outlined" label="Squad Name" value={value} onChangeText={onChange} />
          )}
        />
        <Button
          mode="contained"
          loading={loading}
          onPress={createForm.handleSubmit((values) => createNewSquad({ name: values.name, user }))}
        >
          Create Squad
        </Button>
      </View>

      <Divider />

      <View style={styles.block}>
        <Text variant="titleMedium">Join by Invite Code</Text>
        <Controller
          control={joinForm.control}
          name="inviteCode"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <TextInput mode="outlined" label="Invite Code" value={value} onChangeText={onChange} />
          )}
        />
        <Button
          mode="contained-tonal"
          loading={loading}
          onPress={joinForm.handleSubmit((values) => joinSquad({ inviteCode: values.inviteCode, user }))}
        >
          Join Squad
        </Button>
      </View>

      <Divider />

      <View style={styles.block}>
        <Text variant="titleMedium">Your Squads</Text>
        {squads.length === 0 ? <Text>No squads yet. Create one to begin.</Text> : null}

        <View style={styles.chips}>
          {squads.map((squad) => (
            <Chip key={squad.id} selected={squad.id === selectedSquadId} onPress={() => selectSquad(squad.id)}>
              {squad.name}
            </Chip>
          ))}
        </View>

        {selectedSquad ? (
          <View style={styles.selectedCard}>
            <Text>Selected: {selectedSquad.name}</Text>
            <Text>Invite code: {selectedSquad.inviteCode}</Text>
            <Text>Role: {selectedSquad.role}</Text>
          </View>
        ) : null}
      </View>

      <Divider />

      <View style={styles.block}>
        <Text variant="titleMedium">Members</Text>
        {members.length === 0 ? (
          <Text>No members to show.</Text>
        ) : (
          members.map((member) => (
            <Text key={`${member.squadId}_${member.uid}`}>
              {member.uid} ({member.role})
            </Text>
          ))
        )}
      </View>

      {!!error && <Text style={styles.error}>{error}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    gap: 16,
    padding: 16,
  },
  block: {
    gap: 10,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedCard: {
    borderColor: '#DADADA',
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
    padding: 10,
  },
  error: {
    color: '#B00020',
  },
});
