import React from 'react';
import { StyleSheet, ScrollView, Image, Text, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Section, Button, Spacer } from '../components';
import { ESBUILD_BRAND_COLOR } from '../constants';
import EsbuildLogo from '../assets/esbuild.png';

export function IntroScreen(): React.ReactElement {
  const handlePressGitHub = (): void => {
    Linking.openURL(
      'https://github.com/leegeunhyeok/react-native-esbuild',
    ).catch(() => null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Section>
          <Image style={styles.logo} source={EsbuildLogo} />
        </Section>
        <Section title="Fast">
          <Text style={styles.description}>
            Bundled by <Text style={styles.highlight}>ESBuild</Text>
          </Text>
        </Section>
        <Section title="Live Reload">
          <Text style={styles.description}>
            Support live reload (HMR is not supported)
          </Text>
        </Section>
        <Section title="Tree shaking">
          <Text style={styles.description}>
            Reduce bundle size via tree shaking (powered by{' '}
            <Text style={styles.highlight}>ESBuild</Text>)
          </Text>
        </Section>
        <Section title="Contribute">
          <Text style={styles.description}>
            Report bugs, request features, or anything
          </Text>
          <Button label="GitHub" onPress={handlePressGitHub} />
        </Section>
        <Section title="Experimental">
          <Text style={styles.description}>
            This project not completed yet.
          </Text>
          <Text style={styles.danger}>
            CHECK & TEST BEFORE USING IN PRODUCTION
          </Text>
        </Section>
        <Spacer size={16} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: 16,
  },
  logo: {
    width: 64,
    height: 64,
  },
  description: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: '#333',
  },
  highlight: {
    fontWeight: '700',
    color: 'black',
    backgroundColor: ESBUILD_BRAND_COLOR,
  },
  danger: {
    fontWeight: '700',
    color: 'tomato',
  },
});
