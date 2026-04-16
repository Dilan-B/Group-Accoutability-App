import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { FeedScreen } from '../screens/FeedScreen';
import { GoalsScreen } from '../screens/GoalsScreen';
import { LockInScreen } from '../screens/LockInScreen';
import { SquadProfileScreen } from '../screens/SquadProfileScreen';

const Tab = createBottomTabNavigator();

export function RootTabs() {
  return (
    <Tab.Navigator initialRouteName="Feed">
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Goals" component={GoalsScreen} />
      <Tab.Screen name="Lock-in" component={LockInScreen} />
      <Tab.Screen name="Squad/Profile" component={SquadProfileScreen} />
    </Tab.Navigator>
  );
}
