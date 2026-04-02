import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

import { ProfileScreen } from '../features/profile/ProfileScreen';
import { SquadScreen } from '../features/squads/SquadScreen';

export function SquadProfileScreen() {
  const [tab, setTab] = useState('squads');

  return (
    <View style={styles.container}>
      <View style={styles.switcher}>
        <Button mode={tab === 'squads' ? 'contained' : 'outlined'} onPress={() => setTab('squads')}>
          Squads
        </Button>
        <Button mode={tab === 'profile' ? 'contained' : 'outlined'} onPress={() => setTab('profile')}>
          Profile
        </Button>
      </View>

      <View style={styles.content}>{tab === 'squads' ? <SquadScreen /> : <ProfileScreen />}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  switcher: {
    flexDirection: 'row',
    gap: 8,
    padding: 12,
  },
  content: {
    flex: 1,
  },
});
