export abstract class Storage<StorageData> {
  protected data = new Map<number, StorageData>();
  public abstract get(key: number): StorageData;
  public abstract clearAll(): Promise<void>;
}
