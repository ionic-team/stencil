import * as d from '../declarations';
import exit from 'exit';


export async function taskDocs(config: d.Config) {
  const { Compiler } = require('../compiler/index.js');

  const compiler: d.Compiler = new Compiler(config);
  if (!compiler.isValid) {
    exit(1);
  }

  await compiler.docs();

  config.sys.destroy();
}
