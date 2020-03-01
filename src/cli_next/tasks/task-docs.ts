import * as d from '../../declarations';
import { createCompiler } from '@stencil/core/compiler';
import { isOutputTargetDocs } from '../../compiler/output-targets/output-utils';
import { startupLog } from './startup-log';


export async function taskDocs(prcs: NodeJS.Process, config: d.Config) {  config.devServer = null;
  config.outputTargets = config.outputTargets.filter(isOutputTargetDocs);
  config.devMode = true;

  startupLog(prcs, config);

  const compiler = await createCompiler(config);
  await compiler.build();

  await compiler.destroy();
}
