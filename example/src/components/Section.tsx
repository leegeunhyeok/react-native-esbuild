import React, { type PropsWithChildren } from 'react';
import { styled, View, H2 } from 'dripsy';

type SectionProps = PropsWithChildren<{
  title?: string;
  delay?: number;
}>;

const SectionContainer = styled(View)({
  marginTop: '$04',
  gap: '$02',
});

const SectionTitle = styled(H2, {
  defaultVariant: 'text.primary',
})();

export function Section({ children, title }: SectionProps): JSX.Element {
  return (
    <SectionContainer>
      {title ? <SectionTitle>{title}</SectionTitle> : null}
      {children}
    </SectionContainer>
  );
}
