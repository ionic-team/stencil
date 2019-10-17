import * as d from '../../../declarations';
import { catchError } from '@utils';
import { isOutputTargetDistCollection } from '../../../compiler/output-targets/output-utils';
import path from 'path';


export const collectionOutput = (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, changedModuleFiles: d.Module[]) => {
  const outputTargets = config.outputTargets.filter(isOutputTargetDistCollection);

  if (outputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate collection started`, true);
  try {
    outputTargets.forEach(outputTarget => {
      changedModuleFiles.forEach(mod => {
        const collectionFilePath = path.join(outputTarget.dir, mod.jsFilePath);
        compilerCtx.fs.writeFile(collectionFilePath, mod.staticSourceFileText);
      });
    });

    // await Promise.all(outputTargets.map(async collectionOutputTarget => {
    //   const files = (await compilerCtx.fs.readdir(collectionOutputTarget.dir, { recursive: true })).map(item => {
    //     return item.absPath;
    //   });
    //   const buildOutputTarget: d.BuildOutput = {
    //     type: collectionOutputTarget.type,
    //     files
    //   };
    //   buildCtx.outputs.push(buildOutputTarget);
    // }));

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  timespan.finish(`generate collection finished`);
};
