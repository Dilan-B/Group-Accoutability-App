import { ActivityIndicator, View } from 'react-native';
import { Text } from 'react-native-paper';

import { useAuthStore } from '../features/auth/authStore';
import { AuthScreen } from '../features/auth/AuthScreen';
import { ProfileScreen } from '../features/profile/ProfileScreen';
import { RootTabs } from './RootTabs';

function LoadingState() {
  return (
    <View style={{ alignItems: 'center', flex: 1, gap: 8, justifyContent: 'center' }}>
      <ActivityIndicator />
      <Text>Loading account…</Text>
    </View>
  );
}

export function AppNavigator() {
  const authStatus = useAuthStore((state) => state.authStatus);
  const profile = useAuthStore((state) => state.profile);

  if (authStatus === 'loading') {
    return <LoadingState />;
  }

  if (authStatus !== 'signed_in') {
    return <AuthScreen />;
  }

  if (!profile?.displayName) {
    return <ProfileScreen />;
  }

  return <RootTabs />;
}
