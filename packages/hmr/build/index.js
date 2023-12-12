const path = require('node:path');
const esbuild = require('esbuild');
const { getEsbuildBaseOptions, getPackageRoot } = require('../../../shared');
const { name, version } = require('../package.json');

const buildOptions = getEsbuildBaseOptions(__dirname);
const root = getPackageRoot(__dirname);

(async () => {
  // package
  await esbuild.build(buildOptions);

  // runtime
  await esbuild.build({
    entryPoints: [path.join(root, './lib/runtime/setup.ts')],
    outfile: 'dist/runtime.js',
    bundle: true,
    banner: {
      js: `// ${name}@${version} runtime`,
    },
  });
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
