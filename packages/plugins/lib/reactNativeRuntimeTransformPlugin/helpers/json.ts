import fs from 'node:fs/promises';
import type { PluginBuild } from 'esbuild';
import { registerAsExternalModule } from '@react-native-esbuild/hmr';
import type { BuildContext } from '@react-native-esbuild/shared';

/**
 * When development mode + HMR enabled, the '.json' contents
 * must be registered in the global module registry for HMR.
 */
export const transformJsonAsJsModule = (
  buildContext: BuildContext,
  build: PluginBuild,
): void => {
  if (!buildContext.hmrEnabled) return;

  build.onLoad({ filter: /\.json$/ }, async (args) => {
    const moduleId = buildContext.moduleManager.getModuleId(args.path);
    const rawJson = await fs.readFile(args.path, { encoding: 'utf-8' });
    const parsedJson = JSON.parse(rawJson) as Record<string, unknown>;
    const identifier = 'json';

    return {
      contents: registerAsExternalModule(
        moduleId,
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
