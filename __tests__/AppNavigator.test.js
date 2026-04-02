import React from 'react';
import { render } from '@testing-library/react-native';

import { AppNavigator } from '../src/navigation/AppNavigator';

const mockUseAuthStore = jest.fn();

jest.mock('../src/features/auth/authStore', () => ({
  useAuthStore: (selector) => mockUseAuthStore(selector),
}));

jest.mock('../src/navigation/RootTabs', () => {
  const ReactLocal = require('react');
  const { Text } = require('react-native');

  return {
    RootTabs: () => ReactLocal.createElement(Text, null, 'RootTabsMock'),
  };
});

function withState(state) {
  mockUseAuthStore.mockImplementation((selector) => selector(state));
}

describe('AppNavigator guard behavior', () => {
  afterEach(() => {
    mockUseAuthStore.mockReset();
  });

  it('shows loading state while auth is resolving', () => {
    withState({ authStatus: 'loading', profile: null });
    const { getByText } = render(<AppNavigator />);

    expect(getByText('Loading account…')).toBeTruthy();
  });

  it('shows auth screen for signed-out users', () => {
    withState({ authStatus: 'signed_out', profile: null, authError: '', phoneAuthMessage: '' });
    const { getByText } = render(<AppNavigator />);

    expect(getByText('Welcome to Lockd')).toBeTruthy();
  });

  it('shows root tabs for signed-in users with completed profile', () => {
    withState({ authStatus: 'signed_in', profile: { displayName: 'Test User' } });
    const { getByText } = render(<AppNavigator />);

    expect(getByText('RootTabsMock')).toBeTruthy();
  });
});
