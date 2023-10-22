import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { IntroScreen, MainScreen } from '../screens';
import type { RootStackScreens } from './types';

const RootStack = createStackNavigator<RootStackScreens>();

export function RootStackNavigator(): React.ReactElement {
  return (
    <RootStack.Navigator
      screenOptions={{
        cardStyle: { backgroundColor: 'white', flex: 1 },
      }}
      initialRouteName="Main"
    >
      <RootStack.Screen
        key="Main"
        name="Main"
        component={MainScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen key="Intro" name="Intro" component={IntroScreen} />
    </RootStack.Navigator>
  );
}
