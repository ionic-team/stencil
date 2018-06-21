import * as d from '../declarations';


export class Cache implements d.Cache {
  private failed = 0;
  private skip = false;

  constructor(private config: d.Config, private cacheFs: d.InMemoryFileSystem) {}

  async initCacheDir() {
    if (this.config._isTesting) {
      return;
    }

    if (!this.config.enableCache) {
      this.config.logger.debug(`cache disabled, cacheDir: ${this.config.cacheDir}`);
      this.clearDiskCache();
      return;
    }

    this.config.logger.debug(`cache enabled, cacheDir: ${this.config.cacheDir}`);

    try {
      const readmeFilePath = this.config.sys.path.join(this.config.cacheDir, '_README.log');
      await this.cacheFs.writeFile(readmeFilePath, CACHE_DIR_README);

    } catch (e) {
      this.config.logger.error(`Cache, initCacheDir: ${e}`);
      this.config.enableCache = false;
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
    await this.cacheFs.remove(this.config.cacheDir);
    await this.cacheFs.commit();
  }

  private getCacheFilePath(key: string) {
    return this.config.sys.path.join(this.config.cacheDir, key) + '.log';
  }

  getMemoryStats() {
    return this.cacheFs.getMemoryStats();
  }

}


const MAX_FAILED = 100;


const CACHE_DIR_README = `# Stencil Cache Directory

This directory contains files which the compiler has
cached for faster builds. To disable caching, please set
"enableCache: false" within the stencil.config.js file.

To change the cache directory, please update the
"cacheDir" property within the stencil.config.js file.
`;
