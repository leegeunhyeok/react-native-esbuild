import fs from 'node:fs/promises';
import { isExternal } from 'esbuild-dependency-graph';
import {
  colors,
  type ModuleId,
  type BuildContext,
} from '@react-native-esbuild/shared';
import {
  asHMRUpdateCall,
  asFallbackBoundary,
  type HMRTransformResult,
} from '@react-native-esbuild/hmr';
import { logger } from '../../../shared';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- allow
export class HMRTransformer {
  public static async transformDelta(
    buildContext: BuildContext,
    id: ModuleId,
  ): Promise<HMRTransformResult> {
    try {
      performance.mark(`hmr:build:${id}`);
      const transformResult = await HMRTransformer.transformModules(
        buildContext,
        id,
      );
      const { code, targetModule, transformed } = transformResult;
      const { duration } = performance.measure(
        'hmr:build-duration',
        `hmr:build:${id}`,
      );
      logger.info(
        [
          colors.cyan(targetModule),
          colors.gray(`+ ${transformed - 1} module(s)`),
          'transformed in',
          colors.cyan(`${Math.floor(duration)}ms`),
        ].join(' '),
      );
      return { id, code, fullyReload: false };
    } catch (error) {
      logger.error('unable to transform runtime modules', error as Error);
      return { id, code: '', fullyReload: true };
    }
  }

  private static async transformModules(
    buildContext: BuildContext,
    id: ModuleId,
  ): Promise<{ code: string; targetModule: string; transformed: number }> {
    const dependencyGraph = buildContext.moduleManager.getDependencyGraph();
    const inverseDependencies = dependencyGraph.inverseDependenciesOf(id);
    const targetModule = dependencyGraph.getModule(id).path;

    const transformedCodes = await Promise.all(
      inverseDependencies.map(async (moduleId) => {
        const module = dependencyGraph.getModule(moduleId);

        if (isExternal(module)) {
          logger.debug('external module found', { path: module.path });
          return '';
        }

        const rawCode = await fs.readFile(module.path, 'utf-8');
        logger.debug(colors.cyan(module.path));

        const code = await buildContext.transformer(rawCode, {
          id: moduleId,
          path: module.path,
          pluginData: {
            isEntryPoint: false,
            isRuntimeModule: true,
            externalPattern: buildContext.additionalData.externalPattern,
          },
        });

        return asHMRUpdateCall(id, code);
      }),
    );

    return {
      targetModule,
      code: asFallbackBoundary(transformedCodes.join('\n')),
      transformed: inverseDependencies.length,
    };
  }
}
