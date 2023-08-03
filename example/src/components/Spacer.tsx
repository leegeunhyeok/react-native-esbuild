import React from 'react';
import { View } from 'react-native';

interface SpacerProps {
  size: number;
}

export function Spacer({ size }: SpacerProps): React.ReactElement {
  return <View style={{ height: size }} />;
}
