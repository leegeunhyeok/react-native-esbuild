import React, { useEffect, type PropsWithChildren } from 'react';
import type { ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

interface FadeProps {
  delay?: number;
  style?: ViewStyle;
}

const TRANSLATE_OFFSET = 50;

export function Fade({
  children,
  style,
  delay = 0,
}: PropsWithChildren<FadeProps>): React.ReactElement {
  const styleValue = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => ({
    opacity: styleValue.value,
    transform: [
      {
        translateY: interpolate(
          styleValue.value,
          [0, 1],
          [TRANSLATE_OFFSET, 0],
        ),
      },
    ],
  }));

  useEffect(() => {
    styleValue.value = withDelay(delay, withTiming(1));
  }, [delay]);

  return (
    <Animated.View style={[animatedStyles, style]}>{children}</Animated.View>
  );
}
