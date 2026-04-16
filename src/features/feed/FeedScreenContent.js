import { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { useAuthStore } from '../auth/authStore';
import { useSquadStore } from '../squads/squadStore';
import { useFeedStore } from './feedStore';

const REACTIONS = [
  { key: 'fire', label: '🔥 fire' },
  { key: 'flex', label: '💪 flex' },
  { key: 'clap', label: '👏 clap' },
  { key: '100', label: '💯 100' },
];

function renderMessage(item) {
  if (item.type === 'system') {
    return item.message || 'System event';
  }

  if (item.type === 'goal_created') {
    return `Created goal: ${item.goal_title || 'Untitled Goal'}`;
  }

  if (item.type === 'checkin') {
    return item.note || item.progress_update || 'Checked in on a goal.';
  }

  return 'Feed item';
}

export function FeedScreenContent() {
  const user = useAuthStore((state) => state.user);
  const selectedSquadId = useSquadStore((state) => state.selectedSquadId);

  const items = useFeedStore((state) => state.items);
  const loading = useFeedStore((state) => state.loading);
  const error = useFeedStore((state) => state.error);
  const loadFeed = useFeedStore((state) => state.loadFeed);
  const reactToItem = useFeedStore((state) => state.reactToItem);

  useEffect(() => {
    if (!selectedSquadId) {
      return;
    }

    loadFeed(selectedSquadId);
  }, [loadFeed, selectedSquadId]);

  if (!selectedSquadId) {
    return (
      <View style={styles.centered}>
        <Text>Select a squad in the Squad tab to view feed activity.</Text>
      </View>
    );
  }

  if (loading && items.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>Loading feed…</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineSmall">Squad Feed</Text>

      {items.length === 0 ? <Text>No activity yet. Create a goal or check-in to start the feed.</Text> : null}

      {items.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text>{renderMessage(item)}</Text>
          {item.goal_title ? <Text>Goal: {item.goal_title}</Text> : null}

          <View style={styles.row}>
            {REACTIONS.map((reaction) => (
              <Button
                key={reaction.key}
                compact
                mode="outlined"
                onPress={() => reactToItem({ feedId: item.id, uid: user.uid, reaction: reaction.key, squadId: selectedSquadId })}
              >
                {reaction.label} {item.reactions?.[reaction.key] || 0}
              </Button>
            ))}
          </View>
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
    borderColor: '#DDDDDD',
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  error: {
    color: '#B00020',
  },
});
