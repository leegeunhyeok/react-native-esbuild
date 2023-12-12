import fs from 'node:fs/promises';
import type { PluginBuild } from 'esbuild';
import { HmrTransformer } from '@react-native-esbuild/hmr';

/**
 * When development mode & HMR enabled, the '.json' contents
 * must be registered in the global module registry for HMR.
 */
export const jsonAsJsModule = (build: PluginBuild): void => {
  build.onLoad({ filter: /\.json$/ }, async (args) => {
    const rawJson = await fs.readFile(args.path, { encoding: 'utf-8' });
    const parsedJson = JSON.parse(rawJson) as Record<string, unknown>;
    const identifier = 'json';

    return {
      contents: HmrTransformer.registerAsExternalModule(
        args.path,
        `const ${identifier} = ${rawJson};
        ${Object.keys(parsedJson)
          .map((member) => {
            const memberName = JSON.stringify(member);
            return `exports[${memberName}] = ${identifier}[${memberName}]`;
          })
          .join('\n')}
        module.exports = ${identifier};`,
        identifier,
      ),
      loader: 'js',
    };
  });
};
