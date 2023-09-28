import React from 'react';
import { Analytics } from '@vercel/analytics/react';

export default function Root({children}): JSX.Element {
  return (
    <>
      {children}
      <Analytics />
    </>
  );
}
