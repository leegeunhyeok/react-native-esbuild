import esbuild from 'esbuild';
import { getEsbuildBaseOptions } from '../../../shared/index.mjs';

const buildOptions = getEsbuildBaseOptions(import.meta.dirname, {
  banner: {
    js: '#!/usr/bin/env node',
  },
});

esbuild.build(buildOptions).catch((error) => {
  console.error(error);
  process.exit(1);
});
