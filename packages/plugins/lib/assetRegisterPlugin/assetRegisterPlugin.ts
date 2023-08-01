import type { PluginCreator } from '../types';

export const createAssetRegisterPlugin: PluginCreator<void> = () => ({
  name: 'asset-register-plugin',
  setup: (_build): void => {
    // TODO
  },
});
