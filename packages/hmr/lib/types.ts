import type {
  BabelTransformRule,
  SwcTransformRule,
} from '@react-native-esbuild/transformer';
import type { Metafile, ImportKind } from 'esbuild';

/* eslint-disable no-var -- allow */
declare global {
  type HotModuleReplacementId = string;

  interface HotModuleReplacementRuntimeModule {
    register: (id: HotModuleReplacementId) => void;
    update: (id: HotModuleReplacementId, evalUpdates: () => void) => void;
    // react-refresh/runtime
    reactRefresh: {
      register: (type: unknown, id: string) => void;
      getSignature: () => (
        type: unknown,
        id: string,
        forceReset?: boolean,
        getCustomHooks?: () => unknown[],
      ) => unknown;
      performReactRefresh: () => void;
    };
  }

  // react-native
  var __DEV__: boolean;

  // react-refresh/runtime
  var __hmr: HotModuleReplacementRuntimeModule | undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- allow
  var window: any;
}

export interface PipelineBuilderOptions {
  fullyTransformPackageNames?: string[];
  stripFlowPackageNames?: string[];
  additionalBabelRules?: BabelTransformRule[];
  additionalSwcRules?: SwcTransformRule[];
}

/**
 * HMR web socket messages
 * @see {@link https://github.com/facebook/metro/blob/v0.77.0/packages/metro-runtime/src/modules/types.flow.js#L68}
 */
export type HmrClientMessage =
  | RegisterEntryPointsMessage
  | LogMessage
  | LogOptInMessage;

export interface RegisterEntryPointsMessage {
  type: 'register-entrypoints';
  entryPoints: string[];
}

export interface LogMessage {
  type: 'log';
  level:
    | 'trace'
    | 'info'
    | 'warn'
    | 'log'
    | 'group'
    | 'groupCollapsed'
    | 'groupEnd'
    | 'debug';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- follow metro types
  data: any[];
  mode: 'BRIDGE' | 'NOBRIDGE';
}

export interface LogOptInMessage {
  type: 'log-opt-in';
}

/**
 * HMR update message
 * @see {@link https://github.com/facebook/metro/blob/v0.77.0/packages/metro-runtime/src/modules/types.flow.js#L44-L56}
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- allow type
export type HmrMessage = {
  update: HmrUpdate;
  'update-start': {
    isInitialUpdate: boolean;
  };
  'update-done': undefined;
};

export type HmrMessageType = keyof HmrMessage;

export interface HmrUpdate {
  readonly added: HmrModule[];
  readonly deleted: number[];
  readonly modified: HmrModule[];
  isInitialUpdate: boolean;
  revisionId: string;
}
export interface HmrModule {
  module: [number, string];
  sourceMappingURL: string | null;
  sourceURL: string | null;
}

export type BundleMeta = Metafile & {
  inputs: Metafile['inputs'] & Record<string, ModuleInfo>;
};

// Extended type from `esbuild.Metafile['inputs'][file]`
export interface ModuleInfo {
  bytes: number;
  imports: {
    path: string;
    kind: ImportKind;
    external?: boolean;
    original?: string;
  }[];
  parents?: Set<string>;
  format?: 'cjs' | 'esm';
}

export interface BundleUpdate {
  id: string;
  path: string;
  code: string;
  fullyReload: boolean;
}
