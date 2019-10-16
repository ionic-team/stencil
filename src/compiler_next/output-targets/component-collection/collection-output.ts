import * as d from '../../../declarations';
import { catchError, normalizePath } from '@utils';
import { isOutputTargetDistCollection } from '../../../compiler/output-targets/output-utils';
import path from 'path';


export const collectionOutput = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, changedModuleFiles: d.Module[]) => {
  const timespan = buildCtx.createTimeSpan(`generate collection started`, true);

  try {
    const collectionOutputTargets = config.outputTargets.filter(isOutputTargetDistCollection);

    if (collectionOutputTargets.length > 0) {
      collectionOutputTargets.forEach(outputTarget => {
        changedModuleFiles.forEach(mod => {
          debugger;
          const sourceFilePath = normalizePath(mod.sourceFilePath);
          const outFilePath = sourceFilePath.replace(config.srcDir, '');
          const outFileDir = path.dirname(outFilePath);
          const outFileName = path.basename(mod.jsFilePath);
          const collectionFilePath = path.join(outputTarget.dir, outFileDir, outFileName);
          compilerCtx.fs.writeFile(collectionFilePath, mod.staticSourceFileText);
        });
      });
      await compilerCtx.fs.commit();

      await Promise.all(collectionOutputTargets.map(async collectionOutputTarget => {
        const files = (await compilerCtx.fs.readdir(collectionOutputTarget.dir, { recursive: true })).map(item => {
          return item.absPath;
        });
        const buildOutputTarget: d.BuildOutput = {
          type: collectionOutputTarget.type,
          files
        };
        buildCtx.outputs.push(buildOutputTarget);
      }));
    }

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  timespan.finish(`generate collection finished`);
};
