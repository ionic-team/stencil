import * as d from '../declarations';
import { hasError } from './cli-utils';


export async function taskBuild(process: NodeJS.Process, config: d.Config, flags: d.ConfigFlags) {
  const { Compiler } = require('../compiler/index.js');

  const compiler: d.Compiler = new Compiler(config);
  if (!compiler.isValid) {
    process.exit(1);
  }

  const results = await compiler.build();
  if (!config.watch && hasError(results && results.diagnostics)) {
    config.sys.destroy();
    process.exit(1);
  }

  if (config.watch || (config.devServer && flags.serve)) {
    process.once('SIGINT', () => {
      config.sys.destroy();
    });
  }

  return results;
}
