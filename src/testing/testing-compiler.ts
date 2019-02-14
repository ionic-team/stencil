import * as d from '@declarations';
import { Compiler, validateConfig } from '@compiler';
import { TestingConfig } from './testing-config';


export class TestingCompiler extends Compiler {
  config: d.Config;

  constructor(config?: d.Config) {
    config = config || new TestingConfig();
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

  get fs(): d.InMemoryFileSystem {
    return this.ctx.fs;
  }

}
