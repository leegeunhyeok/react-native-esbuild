import React from 'react';
import { styled, Pressable, Text } from 'dripsy';

interface ButtonProps {
  label: string;
  onPress?: () => void;
}

const ButtonContainer = styled(Pressable)({
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: 56,
  borderRadius: 8,
  backgroundColor: '#e2e2e2',
});

const Label = styled(Text, { defaultVariant: 'text.button' })({
  fontSize: '$button',
});

export function Button({ label, onPress }: ButtonProps): JSX.Element {
  return (
    <ButtonContainer onPress={onPress}>
      <Label>{label}</Label>
    </ButtonContainer>
  );
}
