import React from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Container, View, H1, P } from 'dripsy';
import { Fade, Button } from '../components';
import type { RootStackProps } from '../navigators/types';
import LogoSvg from '../assets/logo.svg';

export function MainScreen({
  navigation,
}: RootStackProps<'Main'>): React.ReactElement {
  const { top, bottom } = useSafeAreaInsets();

  const handlePressStartButton = (): void => {
    navigation.navigate('Intro');
  };

  return (
    <Container sx={{ paddingTop: top, paddingBottom: bottom }}>
      <Fade style={styles.contentArea} delay={500}>
        <LogoSvg width={120} height={120} />
        <H1>React Native Esbuild</H1>
        <P style={styles.subTitle}>
          ⚡️ An extremely fast bundler{'\n'}+{'\n'}React Native
        </P>
      </Fade>
      <Fade delay={750}>
        <Button label="Getting Started" onPress={handlePressStartButton} />
      </Fade>
      <View sx={{ marginBottom: '$04' }} />
    </Container>
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
