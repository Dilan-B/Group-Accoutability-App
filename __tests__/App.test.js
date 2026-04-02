import React from 'react';
import { render, waitFor } from '@testing-library/react-native';

import App from '../App';

describe('Milestone 0 tab shell', () => {
  it('renders the initial Feed placeholder content', async () => {
    const { getByText } = render(<App />);

    await waitFor(() => {
      expect(getByText('Feed')).toBeTruthy();
      expect(getByText('Squad activity will appear here in Milestone 4.')).toBeTruthy();
    });
  });
});
