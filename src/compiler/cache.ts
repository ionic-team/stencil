import { Config } from '../declarations';
import { InMemoryFileSystem } from '../util/in-memory-fs';


export class Cache {
  private failed = 0;
  private skip = false;

  constructor(private config: Config, private cacheFs: InMemoryFileSystem, private tmpDir: string) {
    if (config.enableCache) {
      config.logger.debug(`cache enabled, tmpdir: ${tmpDir}`);

    } else {
      config.logger.debug(`cache disabled, empty tmpdir: ${tmpDir}`);
      this.clearDiskCache();
    }
  }

  async get(key: string) {
    if (!this.config.enableCache || this.skip) {
      return null;
    }

    if (this.failed >= MAX_FAILED) {
      if (!this.skip) {
        this.skip = true;
        this.config.logger.debug(`cache had ${this.failed} failed ops, skip disk ops for remander of build`);
      }
      return null;
    }

    let result: string;
    try {
      result = await this.cacheFs.readFile(this.getCacheFilePath(key));
      this.failed = 0;
      this.skip = false;

    } catch (e) {
      this.failed++;
      result = null;
    }

    return result;
  }

  async put(key: string, value: string) {
    if (!this.config.enableCache) {
      return false;
    }

    let result: boolean;

    try {
      await this.cacheFs.writeFile(this.getCacheFilePath(key), value);
      result = true;
    } catch (e) {
      this.failed++;
      result = false;
    }

    return result;
  }

  createKey(domain: string, ...args: any[]) {
    if (!this.config.enableCache) {
      return '';
    }
    return domain + '_' + this.config.sys.generateContentHash(JSON.stringify(args), 32);
  }

  async commit() {
    if (this.config.enableCache) {
      this.skip = false;
      this.failed = 0;
      await this.cacheFs.commit();
    }
  }

  clear() {
    this.cacheFs.clearCache();
  }

  async clearDiskCache() {
    await this.cacheFs.emptyDir(this.tmpDir);
    await this.cacheFs.commit();
  }

  private getCacheFilePath(key: string) {
    return this.config.sys.path.join(this.tmpDir, key);
  }

}


const MAX_FAILED = 20;
