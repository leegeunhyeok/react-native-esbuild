import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { DripsyProvider } from 'dripsy';
import { RootStackNavigator } from './navigators';
import { themeLight } from './theme';

export function App(): React.JSX.Element {
  const navigationRef = useNavigationContainerRef();

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
