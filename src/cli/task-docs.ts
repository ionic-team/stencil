import * as d from '../declarations';


export function taskDocs(process: NodeJS.Process, config: d.Config) {
  const { Compiler } = require('../compiler/index.js');

  const compiler: d.Compiler = new Compiler(config);
  if (!compiler.isValid) {
    process.exit(1);
  }

  return compiler.docs();
}
