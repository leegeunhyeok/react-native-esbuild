import type { ModuleId } from '@react-native-esbuild/shared';
import * as RefreshRuntime from 'react-refresh/runtime';

type HotModuleReplacementAcceptCallback = (payload: { id: ModuleId }) => void;
type HotModuleReplacementDisposeCallback = () => void;

if (__DEV__ && typeof global.__hmr === 'undefined') {
  const HMR_DEBOUNCE_DELAY = 50;
  let performReactRefreshTimeout: NodeJS.Timeout | null = null;

  class HotModuleReplacementContext {
    public static registry: Record<
      ModuleId,
      HotModuleReplacementContext | undefined
    > = {};
    public locked = false;
    public acceptCallbacks: HotModuleReplacementAcceptCallback[] = [];
    public disposeCallbacks: HotModuleReplacementDisposeCallback[] = [];

    constructor(public id: ModuleId) {}

    accept(acceptCallback: HotModuleReplacementAcceptCallback): void {
      if (this.locked) return;
      this.acceptCallbacks.push(acceptCallback);
    }

    dispose(disposeCallback: HotModuleReplacementDisposeCallback): void {
      if (this.locked) return;
      this.disposeCallbacks.push(disposeCallback);
    }

    lock(): void {
      this.locked = true;
    }
  }

  const HotModuleReplacementRuntimeModule: HotModuleReplacementRuntimeModule = {
    register: (id: ModuleId) => {
      const context = HotModuleReplacementContext.registry[id];
      if (context) {
        context.lock();
        return context;
      }
      return (HotModuleReplacementContext.registry[id] =
        new HotModuleReplacementContext(id));
    },
    update: (
      id: ModuleId,
      inverseDependencies: ModuleId[],
      evalUpdates: () => void,
    ) => {
      const context = HotModuleReplacementContext.registry[id];
      if (context) {
        context.disposeCallbacks.forEach((callback) => {
          callback();
        });
        evalUpdates();
        context.acceptCallbacks.forEach((callback) => {
          callback({ id });
        });

        inverseDependencies.forEach((id) => {
          const context = HotModuleReplacementContext.registry[id];
        });
      }
    },
    reactRefresh: {
      register: RefreshRuntime.register,
      getSignatureFunction: () =>
        RefreshRuntime.createSignatureFunctionForTransform,
      performReactRefresh: () => {
        if (performReactRefreshTimeout !== null) {
          return;
        }

        performReactRefreshTimeout = setTimeout(() => {
          performReactRefreshTimeout = null;
        }, HMR_DEBOUNCE_DELAY);

        if (RefreshRuntime.hasUnrecoverableErrors()) {
          console.error('[HMR::react-refresh] has unrecoverable errors');
          return;
        }
        RefreshRuntime.performReactRefresh();
      },
    },
  };

  RefreshRuntime.injectIntoGlobalHook(global);

  Object.defineProperty(global, '__hmr', {
    enumerable: false,
    value: HotModuleReplacementRuntimeModule,
  });

  // for web
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- allow
  const isWeb = global?.navigator?.appName === 'Netscape';
  if (isWeb) {
    const socketURL = new URL('hot', `ws://${window.location.host}`);
    const socket = new window.WebSocket(socketURL.href);
    socket.addEventListener('message', (event) => {
      const payload = window.JSON.parse(event.data);
      if (payload.type === 'update') {
        const code = payload.body?.added[0]?.module?.[1];
        code && window.eval(code);
      }
    });
  }
}
