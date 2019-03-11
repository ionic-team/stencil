import * as d from '@declarations';


export class Cache implements d.Cache {
  private failed = 0;
  private skip = false;
  private sys: d.StencilSystem;
  private path: d.Path;
  private logger: d.Logger;

  constructor(private config: d.Config, private cacheFs: d.InMemoryFileSystem) {
    this.sys = config.sys;
    this.path = config.sys.path;
    this.logger = config.logger;
  }

  async initCacheDir() {
    if (this.config._isTesting) {
      return;
    }

    if (!this.config.enableCache) {
      this.config.logger.info(`cache optimizations disabled`);
      this.clearDiskCache();
      return;
    }

    this.config.logger.debug(`cache enabled, cacheDir: ${this.config.cacheDir}`);

    try {
      const readmeFilePath = this.path.join(this.config.cacheDir, '_README.log');
      await this.cacheFs.writeFile(readmeFilePath, CACHE_DIR_README);

    } catch (e) {
      this.logger.error(`Cache, initCacheDir: ${e}`);
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
        this.logger.debug(`cache had ${this.failed} failed ops, skip disk ops for remander of build`);
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

  async has(key: string) {
    const val = await this.get(key);
    return (typeof val === 'string');
  }

  createKey(domain: string, ...args: any[]) {
    if (!this.config.enableCache) {
      return domain + (Math.random() * 9999999);
    }
    return domain + '_' + this.sys.generateContentHash(JSON.stringify(args), 32);
  }

  async commit() {
    if (this.config.enableCache) {
      this.skip = false;
      this.failed = 0;
      await this.cacheFs.commit();
      await this.clearExpiredCache();
    }
  }

  clear() {
    if (this.cacheFs != null) {
      this.cacheFs.clearCache();
    }
  }

  async clearExpiredCache() {
    if (this.cacheFs == null) {
      return;
    }

    const now = Date.now();

    const lastClear = await this.sys.storage.get(EXP_STORAGE_KEY) as number;
    if (lastClear != null) {
      const diff = now - lastClear;
      if (diff < ONE_DAY) {
        return;
      }

      const fs = this.cacheFs.disk;
      const cachedFileNames = await fs.readdir(this.config.cacheDir);
      const cachedFilePaths = cachedFileNames.map(f => this.path.join(this.config.cacheDir, f));

      let totalCleared = 0;

      const promises = cachedFilePaths.map(async filePath => {
        const stat = await fs.stat(filePath);
        const lastModified = stat.mtime.getTime();

        const diff = now - lastModified;
        if (diff > ONE_WEEK) {
          await fs.unlink(filePath);
          totalCleared++;
        }
      });

      await Promise.all(promises);

      this.logger.debug(`clearExpiredCache, cachedFileNames: ${cachedFileNames.length}, totalCleared: ${totalCleared}`);
    }

    this.logger.debug(`clearExpiredCache, set last clear`);
    await this.sys.storage.set(EXP_STORAGE_KEY, now);
  }

  async clearDiskCache() {
    if (this.cacheFs != null) {
      const hasAccess = await this.cacheFs.access(this.config.cacheDir);
      if (hasAccess) {
        await this.cacheFs.remove(this.config.cacheDir);
        await this.cacheFs.commit();
      }
    }
  }

  private getCacheFilePath(key: string) {
    return this.path.join(this.config.cacheDir, key) + '.log';
  }

  getMemoryStats() {
    if (this.cacheFs != null) {
      return this.cacheFs.getMemoryStats();
    }
    return null;
  }

}


const MAX_FAILED = 100;
const ONE_DAY = 1000 * 60 * 60 * 24;
const ONE_WEEK = ONE_DAY * 7;
const EXP_STORAGE_KEY = `last_clear_expired_cache`;

const CACHE_DIR_README = `# Stencil Cache Directory

This directory contains files which the compiler has
cached for faster builds. To disable caching, please set
"enableCache: false" within the stencil config.

To change the cache directory, please update the
"cacheDir" property within the stencil config.
`;
