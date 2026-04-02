import React from 'react';
import { render } from '@testing-library/react-native';

import App from '../App';

describe('Milestone 0 tab shell', () => {
  it('renders the four phase-1 tab labels', () => {
    const { getByText } = render(<App />);

    expect(getByText('Feed')).toBeTruthy();
    expect(getByText('Goals')).toBeTruthy();
    expect(getByText('Lock-in')).toBeTruthy();
    expect(getByText('Squad/Profile')).toBeTruthy();
  });
});
