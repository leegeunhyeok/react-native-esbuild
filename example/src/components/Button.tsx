import React from 'react';
import { StyleSheet, Pressable, Text } from 'react-native';

interface ButtonProps {
  label: string;
  onPress?: () => void;
}

export function Button({ label, onPress }: ButtonProps): JSX.Element {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 56,
    borderRadius: 8,
    backgroundColor: '#e2e2e2',
  },
  label: {
    fontSize: 20,
    fontWeight: '600',
  },
});
