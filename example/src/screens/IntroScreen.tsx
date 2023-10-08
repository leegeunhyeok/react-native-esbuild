import React from 'react';
import { Linking } from 'react-native';
import { styled, Container, ScrollView, View, Image, Text, P } from 'dripsy';
import { Section, Button } from '../components';
import Logo from '../assets/logo.png';

const Description = styled(P, {
  defaultVariant: 'text.secondary',
})();

const LogoImage = styled(Image)({
  width: 64,
  height: 64,
});

const FEATURES = [
  '⚡️ Blazing Fast Build',
  '🌳 Supports Tree Shaking',
  '💾 In-memory & Local File System Caching',
  '🎨 Flexible & Extensible',
  '🔥 Supports Hermes Runtime',
  '🔄 Supports Live Reload',
  '🐛 Supports Debugging(Flipper, Chrome Debugger)',
  '🌍 Supports All Platforms(Android, iOS, Web)',
  '✨ New Architecture Ready',
];

export function IntroScreen(): React.ReactElement {
  const handlePressGitHub = (): void => {
    Linking.openURL(
      'https://github.com/leegeunhyeok/react-native-esbuild',
    ).catch(() => null);
  };

  return (
    <Container>
      <ScrollView>
        <Section>
          <LogoImage source={Logo} />
        </Section>
        <Section title="Features">
          {FEATURES.map((content, index) => (
            <Description key={index}>{content}</Description>
          ))}
        </Section>
        <Section title="Contribute">
          <Description>Report bugs, request features, or anything</Description>
          <Button label="GitHub" onPress={handlePressGitHub} />
        </Section>
        <Section title="Experimental">
          <Description>This project is under development.</Description>
          <Text variant="danger">CHECK & TEST BEFORE USING IN PRODUCTION</Text>
        </Section>
        <View sx={{ marginBottom: '$04' }} />
      </ScrollView>
    </Container>
  );
}
