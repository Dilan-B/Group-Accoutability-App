import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Button, SegmentedButtons, Text, TextInput } from 'react-native-paper';

import { useAuthStore } from './authStore';

export function AuthScreen() {
  const [mode, setMode] = useState('phone');
  const [emailMode, setEmailMode] = useState('signin');

  const signInWithEmail = useAuthStore((state) => state.signInWithEmail);
  const signUpWithEmail = useAuthStore((state) => state.signUpWithEmail);
  const startPhoneSignIn = useAuthStore((state) => state.startPhoneSignIn);
  const authError = useAuthStore((state) => state.authError);
  const phoneAuthMessage = useAuthStore((state) => state.phoneAuthMessage);

  const phoneForm = useForm({ defaultValues: { phoneNumber: '' } });
  const emailForm = useForm({ defaultValues: { email: '', password: '', displayName: '' } });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineSmall">Welcome to Lockd</Text>
      <Text style={styles.subtitle}>Milestone 1 auth + profile bootstrap.</Text>

      <SegmentedButtons
        value={mode}
        onValueChange={setMode}
        buttons={[
          { value: 'phone', label: 'Phone (Preferred)' },
          { value: 'email', label: 'Email Fallback' },
        ]}
      />

      {mode === 'phone' ? (
        <View style={styles.block}>
          <Controller
            control={phoneForm.control}
            name="phoneNumber"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                mode="outlined"
                label="Phone Number"
                value={value}
                onChangeText={onChange}
                placeholder="+1 555 123 4567"
                keyboardType="phone-pad"
              />
            )}
          />
          <Button
            mode="contained"
            onPress={phoneForm.handleSubmit((values) => startPhoneSignIn(values))}
            style={styles.button}
          >
            Continue with Phone
          </Button>
          {!!phoneAuthMessage && <Text>{phoneAuthMessage}</Text>}
        </View>
      ) : (
        <View style={styles.block}>
          <SegmentedButtons
            value={emailMode}
            onValueChange={setEmailMode}
            buttons={[
              { value: 'signin', label: 'Sign in' },
              { value: 'signup', label: 'Sign up' },
            ]}
          />

          {emailMode === 'signup' && (
            <Controller
              control={emailForm.control}
              name="displayName"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  mode="outlined"
                  label="Display Name"
                  value={value}
                  onChangeText={onChange}
                  style={styles.input}
                />
              )}
            />
          )}

          <Controller
            control={emailForm.control}
            name="email"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                mode="outlined"
                label="Email"
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
              />
            )}
          />

          <Controller
            control={emailForm.control}
            name="password"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                mode="outlined"
                label="Password"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                style={styles.input}
              />
            )}
          />

          <Button
            mode="contained"
            onPress={emailForm.handleSubmit((values) => {
              if (emailMode === 'signin') {
                signInWithEmail(values);
              } else {
                signUpWithEmail(values);
              }
            })}
            style={styles.button}
          >
            {emailMode === 'signin' ? 'Sign in with Email' : 'Create account with Email'}
          </Button>
        </View>
      )}

      {!!authError && <Text style={styles.error}>{authError}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    gap: 12,
    justifyContent: 'center',
    padding: 16,
  },
  subtitle: {
    opacity: 0.7,
  },
  block: {
    gap: 10,
  },
  input: {
    marginTop: 8,
  },
  button: {
    marginTop: 8,
  },
  error: {
    color: '#B00020',
  },
});
