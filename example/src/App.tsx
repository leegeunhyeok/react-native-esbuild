import React from 'react';
import {
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  View,
  Image,
  Text,
  Linking,
} from 'react-native';
import { Section, Button } from './components';
import { ESBUILD_BRAND_COLOR } from './constants';
import EsbuildLogo from './assets/esbuild.png';

export function App(): JSX.Element {
  const handlePressGitHub = (): void => {
    Linking.openURL(
      'https://github.com/leegeunhyeok/react-native-esbuild',
    ).catch(() => null);
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <ScrollView style={styles.mainContainer}>
        <Section>
          <View style={styles.logoArea}>
            <Image style={styles.logo} source={EsbuildLogo} />
          </View>
          <Text style={styles.headingTitle}>React Native Esbuild</Text>
          <Text style={styles.headingSubTitle}>
            The Next Generation of React Native development environment
          </Text>
        </Section>
        <Section title="Fast" delay={200}>
          <Text style={styles.sectionDescription}>
            Bundled by <Text style={styles.highlight}>ESBuild</Text>
          </Text>
        </Section>
        <Section title="Live Reload" delay={400}>
          <Text style={styles.sectionDescription}>
            Support live reload (HRM is not supported)
          </Text>
        </Section>
        <Section title="Tree shaking" delay={600}>
          <Text style={styles.sectionDescription}>
            Reduce bundle size via tree shaking (powered by{' '}
            <Text style={styles.highlight}>ESBuild</Text>)
          </Text>
        </Section>
        <Section title="Contribute" delay={800}>
          <Text style={styles.sectionDescription}>
            Report bugs, request features, or anything
          </Text>
          <Button label="GitHub" onPress={handlePressGitHub} />
        </Section>
        <Section title="Experimental" delay={1000}>
          <Text style={styles.sectionDescription}>
            This project not completed yet.
          </Text>
          <Text style={styles.danger}>
            CHECK & TEST BEFORE USING IN PRODUCTION
          </Text>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  logoArea: {
    alignItems: 'center',
  },
  logo: {
    width: 64,
    height: 64,
  },
  headingTitle: {
    marginTop: 30,
    fontSize: 30,
    fontWeight: '600',
    textAlign: 'center',
    color: '#222',
  },
  headingSubTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: '#555',
  },
  sectionDescription: {
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
