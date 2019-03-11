import * as d from '../declarations';
import { Compiler } from '../compiler';
import { TestingConfig } from './testing-config';


export class TestingCompiler extends Compiler {
  config: d.Config;

  constructor(config?: d.Config) {
    config = config || new TestingConfig();
    super(config);
  }

  get fs(): d.InMemoryFileSystem {
    return this.ctx.fs;
  }

}
