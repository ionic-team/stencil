import { Compiler } from '../compiler/index';
import { Config } from '../declarations';
import { TestingConfig } from './testing-config';
import { validateConfig } from '../compiler/config/validate-config';
import * as path from 'path';
import { normalizePath } from '../compiler/util';
import * as d from '../declarations';

export class TestingCompiler extends Compiler {

  constructor(config?: Config) {
    if (!config) {
      config = new TestingConfig();
      // POSIX: '/'
      // Windows: 'C:/'
      config.rootDir = path.resolve('/');
    }

    super(config);
  }

  loadConfigFile(configPath: string) {
    const configStr = this.ctx.fs.readFileSync(configPath);

    const configFn = new Function('exports', configStr);
    const exports: any = {};
    configFn(exports);

    Object.assign(this.config, exports.config);

    this.config._isValidated = false;
    validateConfig(this.config);
  }

  public adjustFilePath(posixFilePath: string): string {
    return normalizePath(path.resolve(posixFilePath));
  }

  async readFile(filePath: string, opts?: d.FsReadOptions) {
    const resolvedFilePath = this.adjustFilePath(filePath);
    // POSIX: '/src/index.html'
    // Windows: 'C:/src/index.html'
    return this.fs.readFile(resolvedFilePath, opts);
  }

  async writeFile(filePath: string, content: string, opts?: d.FsWriteOptions) {
    const resolvedFilePath = this.adjustFilePath(filePath);
    // POSIX: '/src/index.html'
    // Windows: 'C:/src/index.html'
    return this.fs.writeFile(resolvedFilePath, content, opts);
  }

  async writeFiles(files: { [filePath: string]: string }, opts?: d.FsWriteOptions) {
    return Promise.all(Object.keys(files).map(filePath => {
      return this.writeFile(filePath, files[filePath], opts);
    }));
  }
}
