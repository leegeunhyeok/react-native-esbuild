import React, { type PropsWithChildren } from 'react';
import { StyleSheet, View, Text } from 'react-native';

type SectionProps = PropsWithChildren<{
  title?: string;
  delay?: number;
}>;

export function Section({ children, title }: SectionProps): JSX.Element {
  return (
    <View style={styles.sectionContainer}>
      {title ? <Text style={styles.sectionTitle}>{title}</Text> : null}
      {children}
    </View>
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
