import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { useFlipper } from '@react-navigation/devtools';
import { DripsyProvider } from 'dripsy';
import { RootStackNavigator } from './navigators';
import { themeLight } from './theme';

export function App(): JSX.Element {
  const navigationRef = useNavigationContainerRef();

  useFlipper(navigationRef);

  useEffect(() => {
    console.log('Hello, world!');
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <DripsyProvider theme={themeLight}>
          <NavigationContainer ref={navigationRef}>
            <RootStackNavigator />
          </NavigationContainer>
        </DripsyProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
