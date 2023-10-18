import * as RefreshRuntime from 'react-refresh/runtime';

if (__DEV__) {
  const HMR_DEBOUNCE_DELAY = 50;
  let performReactRefreshTimeout: NodeJS.Timeout | null = null;

  const isReactRefreshBoundary = (type: unknown): boolean => {
    return Boolean(
      RefreshRuntime.isLikelyComponentType(type) &&
        // @ts-expect-error - expect a ReactElement
        !type?.prototype?.isReactComponent,
    );
  };

  // `global` is defined in the prelude script.
  RefreshRuntime.injectIntoGlobalHook(global);
  global.$RefreshRuntime$ = {
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

        signature(type, id, forceReset, getCustomHooks);
      };
    },
    performReactRefresh: () => {
      if (performReactRefreshTimeout !== null) {
        return;
      }

      performReactRefreshTimeout = setTimeout(() => {
        performReactRefreshTimeout = null;
        if (RefreshRuntime.hasUnrecoverableErrors()) {
          console.error('hot reload: has unrecoverable errors');
          return;
        }
        RefreshRuntime.performReactRefresh();
      }, HMR_DEBOUNCE_DELAY);
    },
  };

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
