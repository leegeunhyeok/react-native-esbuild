/* eslint-disable @typescript-eslint/no-unsafe-return -- mock */
import 'react-native-gesture-handler/jestSetup';
import { setUpTests } from 'react-native-reanimated';

setUpTests();

jest.mock('@react-navigation/devtools', () => ({ useFlipper: jest.fn() }));

jest.mock('dripsy', () => ({
  styled: jest.fn().mockImplementation((value) => () => value),
  makeTheme: jest.fn().mockImplementation((value) => value),
}));
