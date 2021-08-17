import type * as d from '../../../declarations';
import { catchError, getStencilCompilerContext } from '@utils';
import { isOutputTargetDistCollection } from '../output-utils';
import { join, relative } from 'path';
import { writeCollectionManifests } from '../output-collection';

export const outputCollection = async (config: d.Config, buildCtx: d.BuildCtx, changedModuleFiles: d.Module[]) => {
  const outputTargets = config.outputTargets.filter(isOutputTargetDistCollection);
  if (outputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate collections started`, true);
  try {
    await Promise.all(
      changedModuleFiles.map(async (mod) => {
        const code = mod.staticSourceFileText;

        await Promise.all(
          outputTargets.map(async (o) => {
            const relPath = relative(config.srcDir, mod.jsFilePath);
            const filePath = join(o.collectionDir, relPath);
            await getStencilCompilerContext().fs.writeFile(filePath, code, { outputTargetType: o.type });
          })
        );
      })
    );

    await writeCollectionManifests(config, buildCtx, outputTargets);
  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  timespan.finish(`generate collections finished`);
};
