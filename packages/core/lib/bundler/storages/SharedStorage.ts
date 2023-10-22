import type { BundlerSharedData } from '../../types';
import { Storage } from './Storage';

export class SharedStorage extends Storage<BundlerSharedData> {
  private getDefaultSharedData(): BundlerSharedData {
    return {
      watcher: {
        changed: null,
        stats: undefined,
      },
    };
  }

  public get(key: number): BundlerSharedData {
    if (this.data.has(key)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- has()
      return this.data.get(key)!;
    }

    const sharedData = this.getDefaultSharedData();
    this.data.set(key, sharedData);

    return sharedData;
  }

  public setValue(value: Partial<BundlerSharedData>): void {
    for (const sharedData of this.data.values()) {
      sharedData.watcher.changed =
        value.watcher?.changed ?? sharedData.watcher.changed;
      sharedData.watcher.stats =
        value.watcher?.stats ?? sharedData.watcher.stats;
    }
  }

  public clearAll(): Promise<void> {
    for (const sharedData of this.data.values()) {
      sharedData.watcher.changed = null;
      sharedData.watcher.stats = undefined;
    }
    return Promise.resolve();
  }
}
