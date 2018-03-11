import { Compiler } from '../compiler/index';
import { Config } from '../declarations';
import { TestingConfig } from './testing-config';
import { validateConfig } from '../compiler/config/validate-config';


export class TestingCompiler extends Compiler {

  constructor(config?: Config) {
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

}
