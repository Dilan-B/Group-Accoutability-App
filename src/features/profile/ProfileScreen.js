import { StyleSheet, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Button, Text, TextInput } from 'react-native-paper';

import { useAuthStore } from '../auth/authStore';

export function ProfileScreen() {
  const profile = useAuthStore((state) => state.profile);
  const saveProfile = useAuthStore((state) => state.saveProfile);
  const profileSaving = useAuthStore((state) => state.profileSaving);
  const logout = useAuthStore((state) => state.logout);

  const { control, handleSubmit } = useForm({
    values: {
      displayName: profile?.displayName || '',
      avatarUrl: profile?.avatarUrl || '',
      tagline: profile?.tagline || '',
    },
  });

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall">Profile</Text>

      <Controller
        control={control}
        name="displayName"
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <TextInput mode="outlined" label="Display Name" value={value} onChangeText={onChange} />
        )}
      />

      <Controller
        control={control}
        name="avatarUrl"
        render={({ field: { onChange, value } }) => (
          <TextInput
            mode="outlined"
            label="Avatar URL"
            value={value}
            onChangeText={onChange}
            autoCapitalize="none"
          />
        )}
      />

      <Controller
        control={control}
        name="tagline"
        render={({ field: { onChange, value } }) => (
          <TextInput mode="outlined" label="Tagline (Optional)" value={value} onChangeText={onChange} />
        )}
      />

      <Button mode="contained" onPress={handleSubmit((values) => saveProfile(values))} loading={profileSaving}>
        Save Profile
      </Button>

      <Button mode="outlined" onPress={logout}>
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
    padding: 16,
  },
});
