import type { ParamListBase } from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';

export interface RootStackScreens extends ParamListBase {
  Main: undefined;
  Intro: undefined;
}

export type RootStackProps<RouteName extends keyof RootStackScreens> =
  StackScreenProps<RootStackScreens, RouteName>;
