import fs from 'node:fs/promises';
import path from 'node:path';
import type { Metafile } from 'esbuild';
import { getReloadByDevSettingsProxy } from '@react-native-esbuild/internal';
import {
  AsyncTransformPipeline,
  swcPresets,
} from '@react-native-esbuild/transformer';
import type { TransformerContext } from '@react-native-esbuild/transformer';
import { colors } from '@react-native-esbuild/utils';
import { logger } from './shared';
import {
  HMR_REGISTER_FUNCTION,
  HMR_UPDATE_FUNCTION,
  REACT_REFRESH_REGISTER_FUNCTION,
  REACT_REFRESH_SIGNATURE_FUNCTION,
} from './constants';
import type {
  BundleMeta,
  BundleUpdate,
  ModuleInfo,
  PipelineBuilderOptions,
} from './types';

const DUMMY_ESBUILD_ARGS = {
  namespace: '',
  suffix: '',
  pluginData: undefined,
} as const;

export class HmrTransformer {
  private static boundaryIndex = 0;
  private stripRootRegex: RegExp;
  private externalPatternRegex: RegExp;
  private pipeline: AsyncTransformPipeline;

  public static isBoundary(path: string): boolean {
    // `runtime.js`: To avoid wrong HMR behavior in monorepo.
    return !path.includes('/node_modules/') && !path.endsWith('runtime.js');
  }

  public static asBoundary(id: string, code: string): string {
    const ident = `__hmr${HmrTransformer.boundaryIndex++}`;
    return `var ${ident} = ${HMR_REGISTER_FUNCTION}(${JSON.stringify(id)});
    ${code}
    ${ident}.dispose(function () { });
    ${ident}.accept(function (payload) {
      global.__hmr.reactRefresh.performReactRefresh();
    });`;
  }

  public static registerAsExternalModule(
    id: string,
    code: string,
    identifier: string,
  ): string {
    return `${code}\nglobal.__modules.external(${JSON.stringify(
      id,
    )}, ${identifier});`;
  }

  constructor(
    private context: Omit<TransformerContext, 'path'> & {
      externalPattern: string;
    },
    builderOptions: PipelineBuilderOptions,
  ) {
    const {
      fullyTransformPackageNames = [],
      stripFlowPackageNames = [],
      additionalBabelRules = [],
      additionalSwcRules = [],
    } = builderOptions;
    this.stripRootRegex = new RegExp(`^${context.root}/?`);
    this.externalPatternRegex = new RegExp(context.externalPattern);
    this.pipeline = new AsyncTransformPipeline.builder(context)
      .setSwcPreset(
        swcPresets.getReactNativeRuntimePreset({
          experimental: {
            hmr: {
              runtime: true,
              refreshReg: REACT_REFRESH_REGISTER_FUNCTION,
              refreshSig: REACT_REFRESH_SIGNATURE_FUNCTION,
            },
          },
        }),
      )
      .setFullyTransformPackages(fullyTransformPackageNames)
      .setStripFlowPackages(stripFlowPackageNames)
      .setAdditionalBabelTransformRules(additionalBabelRules)
      .setAdditionalSwcTransformRules(additionalSwcRules)
      .build();
  }

  /**
   * Enhance `esbuild.Metafile` to `BundleMeta`.
   *
   * Add `parents` property into each module info.
   * This property will be used as indexed value for explore parent modules.
   */
  public static createBundleMeta(metafile: Metafile): BundleMeta {
    const bundleMeta = metafile as BundleMeta;
    Object.entries(bundleMeta.inputs).forEach(([filename, moduleInfo]) => {
      moduleInfo.imports.forEach(({ path }) => {
        const moduleInfo = bundleMeta.inputs[path];

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- can be `undefined`.
        if (!moduleInfo) {
          logger.debug(`'${path}' is not exist in esbuild metafile`);
          return;
        }

        if (!bundleMeta.inputs[path].parents) {
          bundleMeta.inputs[path].parents = new Set();
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- after if statement.
        bundleMeta.inputs[path].parents!.add(filename);
      });
    });
    return bundleMeta;
  }

  public async getDelta(
    modulePath: string,
    metafile: Metafile,
  ): Promise<BundleUpdate> {
    try {
      const startedAt = performance.now();
      const { code, target, dependencies } = await this.transformRuntime(
        modulePath,
        metafile,
      );
      const endedAt = performance.now();
      this.stripRoot(modulePath);
      logger.info(
        [
          target,
          colors.gray(`+ ${dependencies} module(s)`),
          'transformed in',
          colors.cyan(`${Math.floor(endedAt - startedAt)}ms`),
        ].join(' '),
      );
      return {
        id: '',
        code: this.asFallbackBoundary(code),
        path: modulePath,
        fullyReload: false,
      };
    } catch (error) {
      logger.error('unable to transform runtime modules', error as Error);
      return {
        id: '',
        code: '',
        path: modulePath,
        fullyReload: true,
      };
    }
  }

  private stripRoot(path: string): string {
    return path.replace(this.stripRootRegex, '');
  }

  private async transformRuntime(
    modulePath: string,
    bundleMeta: BundleMeta,
  ): Promise<{ code: string; target: string; dependencies: number }> {
    const strippedModulePath = this.stripRoot(modulePath);
    const reverseDependencies = this.getReverseDependencies(
      strippedModulePath,
      bundleMeta,
    );
    const transformFlags: Record<string, boolean> = {};
    const transformedCodes = await Promise.all(
      [modulePath, ...reverseDependencies].map(async (modulePath) => {
        // To avoid re-transformation.
        if (transformFlags[modulePath]) {
          return '';
        }
        transformFlags[modulePath] = true;

        const rawCode = await fs.readFile(modulePath, 'utf-8');
        const importPaths = this.getActualImportPaths(
          this.stripRoot(modulePath),
          bundleMeta,
        );

        const { code } = await this.pipeline.transform(
          rawCode,
          { ...DUMMY_ESBUILD_ARGS, path: modulePath },
          { externalPattern: this.context.externalPattern, importPaths },
        );

        return this.asCallHmrUpdate(modulePath, code);
      }),
    );

    return {
      code: transformedCodes.join('\n'),
      target: strippedModulePath,
      dependencies: Object.keys(transformFlags).length,
    };
  }

  private getTargetModuleInfo(
    targetModule: string,
    bundleMeta: BundleMeta,
  ): ModuleInfo {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- can be `undefined`
    if (!bundleMeta.inputs[targetModule]) {
      throw new Error(`[HMR] ${targetModule} not found in bundle meta`);
    }
    return bundleMeta.inputs[targetModule];
  }

  private getActualImportPaths(
    targetModule: string,
    bundleMeta: BundleMeta,
  ): Record<string, string> {
    logger.debug(`${colors.cyan(targetModule)} imports`);
    const moduleInfo = this.getTargetModuleInfo(targetModule, bundleMeta);
    const importPaths = moduleInfo.imports.reduce(
      (prev, curr) => {
        // To avoid wrong assets path.
        // eg. `react-native-esbuild-assets:/path/to/assets`
        const splitted = path.resolve(this.context.root, curr.path).split(':');
        const actualPath = splitted[splitted.length - 1];
        if (curr.original && !prev[curr.original]) {
          logger.debug(
            `${colors.gray(`├─ ${this.stripRoot(curr.original)} ▸`)} ${
              this.externalPatternRegex.test(curr.original)
                ? colors.gray('<external>')
                : this.stripRoot(actualPath)
            }`,
          );
        }
        return {
          ...prev,
          ...(curr.original ? { [curr.original]: actualPath } : null),
        };
      },
      {} as Record<string, string>,
    );

    logger.debug(
      colors.gray(`╰─ ${Object.keys(importPaths).length} import(s)`),
    );

    return importPaths;
  }

  private getReverseDependencies(
    targetModule: string,
    bundleMeta: BundleMeta,
    dependencies: string[] = [],
    depth = 0,
  ): string[] {
    if (depth === 0) logger.debug(colors.gray(targetModule));

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- can be `undefined`
    if (bundleMeta.inputs[targetModule]?.parents) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- after if statement.
      bundleMeta.inputs[targetModule].parents!.forEach((parentModule) => {
        const spaces = new Array(depth * 3).fill(' ').join('');
        logger.debug(colors.gray(`${spaces}╰─ ${parentModule}`));

        dependencies = this.getReverseDependencies(
          parentModule,
          bundleMeta,
          [...dependencies, path.join(this.context.root, parentModule)],
          depth + 1,
        );
      });
    }

    return dependencies;
  }

  private asCallHmrUpdate(id: string, code: string): string {
    return `${HMR_UPDATE_FUNCTION}(${JSON.stringify(id)}, function () {
      ${code}
    });`;
  }

  private asFallbackBoundary(code: string): string {
    return `try {
      ${code}
    } catch (error) {
      console.error('[HMR] unable to accept', error);
      ${getReloadByDevSettingsProxy()}
    }`;
  }
}
