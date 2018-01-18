import { Compiler } from '../compiler/index';
import { TestingConfig } from './testing-config';


export class TestingCompiler extends Compiler {

  constructor() {
    super(new TestingConfig());
  }

}
