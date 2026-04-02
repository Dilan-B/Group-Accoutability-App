import React from 'react';
import fs from 'node:fs';
import { render } from '@testing-library/react-native';

import { FeedScreen } from '../src/screens/FeedScreen';
import { PlaceholderScreen } from '../src/components/PlaceholderScreen';

describe('Milestone 0 smoke tests', () => {
  it('renders placeholder component content', () => {
    const { getByText } = render(
      <PlaceholderScreen title="Feed" description="Squad activity will appear here in Milestone 4." />,
    );

    expect(getByText('Feed')).toBeTruthy();
    expect(getByText('Squad activity will appear here in Milestone 4.')).toBeTruthy();
  });

  it('renders FeedScreen placeholder content', () => {
    const { getByText } = render(<FeedScreen />);

    expect(getByText('Feed')).toBeTruthy();
    expect(getByText('Squad activity will appear here in Milestone 4.')).toBeTruthy();
  });

  it('declares all Milestone 0 tab routes', () => {
    const tabsSource = fs.readFileSync('src/navigation/RootTabs.js', 'utf8');

    expect(tabsSource).toContain('name="Feed"');
    expect(tabsSource).toContain('name="Goals"');
    expect(tabsSource).toContain('name="Lock-in"');
    expect(tabsSource).toContain('name="Squad/Profile"');
  });
});
