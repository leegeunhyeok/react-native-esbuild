import * as RefreshRuntime from 'react-refresh/runtime';

type HotModuleReplacementAcceptCallback = (payload: {
  id: HotModuleReplacementId;
}) => void;

type HotModuleReplacementDisposeCallback = () => void;

if (__DEV__ && typeof global.__hmr === 'undefined') {
  const HMR_DEBOUNCE_DELAY = 50;
  let performReactRefreshTimeout: NodeJS.Timeout | null = null;

  class HotModuleReplacementContext {
    public static registry: Record<
      HotModuleReplacementId,
      HotModuleReplacementContext | undefined
    > = {};
    public locked = false;
    public acceptCallbacks: HotModuleReplacementAcceptCallback[] = [];
    public disposeCallbacks: HotModuleReplacementDisposeCallback[] = [];

    constructor(public id: HotModuleReplacementId) {}

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

  const isReactRefreshBoundary = (type: unknown): boolean => {
    return Boolean(
      RefreshRuntime.isLikelyComponentType(type) &&
        // @ts-expect-error - expect a ReactElement
        !type?.prototype?.isReactComponent,
    );
  };

  const HotModuleReplacementRuntimeModule: HotModuleReplacementRuntimeModule = {
    register: (id: HotModuleReplacementId) => {
      const context = HotModuleReplacementContext.registry[id];
      if (context) {
        context.lock();
        return context;
      }
      return (HotModuleReplacementContext.registry[id] =
        new HotModuleReplacementContext(id));
    },
    update: (id: HotModuleReplacementId, evalUpdates: () => void) => {
      const context = HotModuleReplacementContext.registry[id];
      context?.disposeCallbacks.forEach((callback) => {
        callback();
      });
      evalUpdates();
      context?.acceptCallbacks.forEach((callback) => {
        callback({ id });
      });
    },
    reactRefresh: {
      register: (type: unknown, id: string) => {
        if (!isReactRefreshBoundary(type)) return;
        RefreshRuntime.register(type, id);
      },
      getSignature: () => {
        const signature: any =
          // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression -- Wrong type definition.
          RefreshRuntime.createSignatureFunctionForTransform();
        return (
          type: unknown,
          id: string,
          forceReset?: boolean,
          getCustomHooks?: () => unknown[],
        ) => {
          if (!isReactRefreshBoundary(type)) return;

          return signature(type, id, forceReset, getCustomHooks) as unknown;
        };
      },
      performReactRefresh: () => {
        if (performReactRefreshTimeout !== null) {
          return;
        }

        performReactRefreshTimeout = setTimeout(() => {
          performReactRefreshTimeout = null;
          if (RefreshRuntime.hasUnrecoverableErrors()) {
            console.error('[HMR::react-refresh] has unrecoverable errors');
            return;
          }
          RefreshRuntime.performReactRefresh();
        }, HMR_DEBOUNCE_DELAY);
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
