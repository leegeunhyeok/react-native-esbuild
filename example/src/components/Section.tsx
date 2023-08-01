import React, { useRef, useEffect, type PropsWithChildren } from 'react';
import { StyleSheet, Animated, Text } from 'react-native';

type SectionProps = PropsWithChildren<{
  title?: string;
  delay?: number;
}>;

export function Section({
  children,
  title,
  delay = 0,
}: SectionProps): JSX.Element {
  const animate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animate, {
      toValue: 1,
      delay,
      useNativeDriver: true,
    }).start();
  }, [animate, delay]);

  return (
    <Animated.View
      style={[
        styles.sectionContainer,
        {
          opacity: animate,
          transform: [
            {
              translateY: animate.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        },
      ]}
    >
      {title ? <Text style={styles.sectionTitle}>{title}</Text> : null}
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#222',
  },
});
