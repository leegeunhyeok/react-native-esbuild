import type {
  register,
  createSignatureFunctionForTransform,
} from 'react-refresh';
import type { ModuleId } from '@react-native-esbuild/shared';

/* eslint-disable no-var -- allow */
declare global {
  interface HotModuleReplacementRuntimeModule {
    register: (id: ModuleId) => void;
    update: (id: ModuleId, evalUpdates: () => void) => void;
    // react-refresh/runtime
    reactRefresh: {
      register: typeof register;
      getSignatureFunction: () => typeof createSignatureFunctionForTransform;
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

/**
 * HMR web socket messages
 * @see {@link https://github.com/facebook/metro/blob/v0.77.0/packages/metro-runtime/src/modules/types.flow.js#L68}
 */
export type HMRClientMessage =
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
export type HMRMessage = {
  update: HMRUpdate;
  'update-start': {
    isInitialUpdate: boolean;
  };
  'update-done': undefined;
};

export type HMRMessageType = keyof HMRMessage;

export interface HMRUpdate {
  readonly added: HMRModule[];
  readonly deleted: ModuleId[];
  readonly modified: HMRModule[];
  isInitialUpdate: boolean;
  revisionId: string;
}
export interface HMRModule {
  module: [ModuleId, string];
  sourceMappingURL: string | null;
  sourceURL: string | null;
}

export interface HMRTransformResult {
  id: ModuleId;
  code: string;
  fullyReload: boolean;
}
