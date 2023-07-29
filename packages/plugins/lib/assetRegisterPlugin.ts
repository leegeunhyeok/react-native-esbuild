import type { PluginCreator } from './types';

export const createAssetRegisterPlugin: PluginCreator<void> = () => ({
  name: 'asset-register',
  setup: (_build): void => {
    // TODO
  },
});
