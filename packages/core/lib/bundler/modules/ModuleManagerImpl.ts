import type { ModuleManager, ModuleId } from '@react-native-esbuild/shared';

type ModuleIds = Record<string, ModuleId>;

export class ModuleManagerImpl implements ModuleManager {
  // Entry point module id is always 0.
  private static ENTRY_POINT_MODULE_ID = 0;
  private INTERNAL_id = ModuleManagerImpl.ENTRY_POINT_MODULE_ID + 1;
  private INTERNAL_moduleIds: ModuleIds = {};

  public getModuleId(modulePath: string, isEntryPoint?: boolean): ModuleId {
    // Already generated.
    if (typeof this.INTERNAL_moduleIds[modulePath] === 'number') {
      return this.INTERNAL_moduleIds[modulePath];
    }

    // Generate new module id.
    return (this.INTERNAL_moduleIds[modulePath] = isEntryPoint
      ? ModuleManagerImpl.ENTRY_POINT_MODULE_ID
      : this.INTERNAL_id++);
  }

  public getModuleIds(): ModuleIds {
    return this.INTERNAL_moduleIds;
  }
}
