import type { BundlerSharedData } from '../../types';
import { Storage } from './Storage';

export class SharedStorage extends Storage<BundlerSharedData> {
  private static instance: SharedStorage | null = null;

  public static getInstance(): SharedStorage {
    if (SharedStorage.instance === null) {
      SharedStorage.instance = new SharedStorage();
    }
    return SharedStorage.instance;
  }

  private constructor() {
    super();
  }

  private getDefaultSharedData(): BundlerSharedData {
    return { bundleMeta: undefined };
  }

  public get(key: number): BundlerSharedData {
    if (this.data.has(key)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Already `has()` checked.
      return this.data.get(key)!;
    }

    const sharedData = this.getDefaultSharedData();
    this.data.set(key, sharedData);

    return sharedData;
  }

  public setValue(value: Partial<BundlerSharedData>): void {
    for (const sharedData of this.data.values()) {
      sharedData.bundleMeta = value.bundleMeta;
    }
  }

  public clearAll(): Promise<void> {
    for (const sharedData of this.data.values()) {
      sharedData.bundleMeta = undefined;
    }
    return Promise.resolve();
  }
}
