import { Compiler } from '../compiler/index';
import { TestingConfig } from './testing-config';
import { validateBuildConfig } from '../compiler/config/validate-config';


export class TestingCompiler extends Compiler {

  constructor() {
    super(new TestingConfig());
  }

  loadConfigFile(configPath: string) {
    const configStr = this.ctx.fs.readFileSync(configPath);

    const configFn = new Function('exports', configStr);
    const exports: any = {};
    configFn(exports);

    Object.assign(this.config, exports.config);

    this.config._isValidated = false;
    validateBuildConfig(this.config);
  }

}
