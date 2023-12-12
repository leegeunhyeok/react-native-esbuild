import fs from 'node:fs';
import path from 'node:path';

export const getExternalFromPackageJson = (root: string): string[] => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- allow any.
  const { dependencies = {} } = JSON.parse(
    fs.readFileSync(path.join(root, 'package.json'), 'utf-8'),
  );
  return [
    'react/jsx-runtime',
    '@react-navigation/devtools',
    ...Object.keys(dependencies as Record<string, string>),
  ];
};
