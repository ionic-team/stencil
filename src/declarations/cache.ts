

export interface Cache {
  get(key: string): Promise<string>;
  put(key: string, value: string): Promise<boolean>;
  has(key: string): Promise<boolean>;
  createKey(domain: string, ...args: any[]): Promise<string>;
  commit(): Promise<void>;
  clear(): void;
  clearDiskCache(): Promise<void>;
  getMemoryStats(): string;
  initCacheDir(): Promise<void>;
}
