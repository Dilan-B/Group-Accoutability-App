import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('react-native-worklets', () => ({
  createWorkletRuntime: jest.fn(),
  runOnJS: (fn) => fn,
  runOnUI: (fn) => fn,
}));
