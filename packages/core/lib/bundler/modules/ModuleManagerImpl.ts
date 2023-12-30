import type { ModuleManager, ModuleId } from '@react-native-esbuild/shared';
import type { Metafile } from 'esbuild';
import { DependencyGraph } from 'esbuild-dependency-graph';
import invariant from 'invariant';

type ModuleIds = Record<string, ModuleId>;

export class ModuleManagerImpl implements ModuleManager {
  // Entry point module id is always 0.
  private static ENTRY_POINT_MODULE_ID = 0;
  private index = ModuleManagerImpl.ENTRY_POINT_MODULE_ID + 1;
  private moduleIds: ModuleIds = {};
  private dependencyGraph: DependencyGraph | null = null;
  private stripRootRegExp: RegExp;

  constructor(root: string) {
    this.stripRootRegExp = new RegExp(`^${root}/?`);
  }

  public getModuleId(modulePath: string, isEntryPoint?: boolean): ModuleId {
    // Already generated.
    if (typeof this.moduleIds[modulePath] === 'number') {
      return this.moduleIds[modulePath];
    }

    // Generate new module id.
    return (this.moduleIds[modulePath] = isEntryPoint
      ? ModuleManagerImpl.ENTRY_POINT_MODULE_ID
      : this.index++);
  }

  public getModuleIds(): ModuleIds {
    return Object.entries(this.moduleIds).reduce(
      (prev, [modulePath, moduleId]) => {
        return {
          ...prev,
          [modulePath.replace(this.stripRootRegExp, '')]: moduleId,
        };
      },
      {},
    );
  }

  public initializeDependencyGraph(
    metafile: Metafile,
    entryPoint: string,
  ): DependencyGraph {
    return (this.dependencyGraph = new DependencyGraph(
      metafile,
      entryPoint,
      this.getModuleIds(),
    ));
  }

  public getDependencyGraph(): DependencyGraph {
    invariant(this.dependencyGraph, 'dependency graph is not initialized');
    return this.dependencyGraph;
  }
}
