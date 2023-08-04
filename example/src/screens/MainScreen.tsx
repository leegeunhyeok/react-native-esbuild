import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Fade, Button } from '../components';
import type { RootStackProps } from '../navigators/types';
import SvgEsbuildLogo from '../assets/esbuild.svg';

export function MainScreen({
  navigation,
}: RootStackProps<'Main'>): React.ReactElement {
  const handlePressStartButton = (): void => {
    navigation.navigate('Intro');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Fade style={styles.contentArea} delay={500}>
        <SvgEsbuildLogo width={120} height={120} />
        <Text style={styles.title}>React Native Esbuild</Text>
        <Text style={styles.subTitle}>
          ⚡️ An extremely fast bundler{'\n'}+{'\n'}React Native
        </Text>
      </Fade>
      <Fade delay={750}>
        <Button label="Getting Started" onPress={handlePressStartButton} />
      </Fade>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    justifyContent: 'space-between',
  },
  contentArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
    textAlign: 'center',
    color: '#222',
  },
  subTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: '#555',
  },
});
