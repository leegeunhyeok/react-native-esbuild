import fs from 'node:fs/promises';
import { isExternal, type DependencyGraph } from 'esbuild-dependency-graph';
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
import type { AsyncTransformPipeline } from '../AsyncTransformPipeline';
import { getCommonReactNativeRuntimePipelineBuilder } from '../../common';
import { logger } from '../../shared';

export class HMRTransformPipeline {
  private pipeline: AsyncTransformPipeline;
  private dependencyGraph: DependencyGraph | null = null;

  constructor(private buildContext: BuildContext) {
    this.pipeline =
      getCommonReactNativeRuntimePipelineBuilder(buildContext).build();
  }

  public setDependencyGraph(dependencyGraph: DependencyGraph): void {
    this.dependencyGraph = dependencyGraph;
  }

  public async transformDelta(id: ModuleId): Promise<HMRTransformResult> {
    try {
      performance.mark(`hmr:build:${id}`);
      const transformResult = await this.transform(id);
      const { code, dependencies } = transformResult;
      const { duration } = performance.measure(
        'hmr:build-duration',
        `hmr:build:${id}`,
      );
      logger.info(
        [
          colors.gray(`+ ${dependencies} module(s)`),
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

  private async transform(
    id: ModuleId,
  ): Promise<{ code: string; dependencies: number }> {
    const dependencyGraph = this.dependencyGraph;
    if (!dependencyGraph) {
      throw new Error('dependency graph is not initialized');
    }

    const inverseDependencies = dependencyGraph.inverseDependenciesOf(id);
    const transformedCodes = await Promise.all(
      [id, ...inverseDependencies].map(async (moduleId) => {
        const module = dependencyGraph.getModule(moduleId);

        if (isExternal(module)) {
          logger.debug('external module found', { path: module.path });
          return '';
        }

        const rawCode = await fs.readFile(module.path, 'utf-8');
        logger.debug(`${colors.cyan(module.path)} imports`);

        const { code } = await this.pipeline.transform(rawCode, {
          id: moduleId,
          path: module.path,
          pluginData: {
            isEntryPoint: false,
            externalPattern: this.buildContext.additionalData.externalPattern,
          },
        });

        return asHMRUpdateCall(id, code);
      }),
    );

    return {
      code: asFallbackBoundary(transformedCodes.join('\n')),
      dependencies: inverseDependencies.length - 1,
    };
  }
}
