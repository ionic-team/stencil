import * as d from '../../declarations';
import { catchError, pathJoin } from '../util';
import { createBundle } from './rollup-bundle';
import { writeAmdModules, writeEntryModules, writeEsmModules } from './write-bundles';


export async function generateBundleModules(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, entryModules: d.EntryModule[]): Promise<d.JSModuleFormats> {

  if (entryModules.length === 0) {
    // no entry modules, so don't bother
    return undefined;
  }

  await writeEntryModules(config, compilerCtx, entryModules);

  // Check for index.js file. This file is used for stencil project exports
  // usually this contains utility exports.
  // If it exists then add it as an entry point.
  const exportedFile = pathJoin(config, config.srcDir, 'index.js');
  const fileExists = await compilerCtx.fs.access(exportedFile);
  if (fileExists) {
    buildCtx.entryModules.push({
      entryKey: 'exportedFile',
      filePath: exportedFile,
      moduleFiles: []
    });
  }

  try {
    // run rollup, but don't generate yet
    // returned rollup bundle can be reused for es module and legacy
    const rollupBundle = await createBundle(config, compilerCtx, buildCtx, entryModules);
    if (buildCtx.hasError || !buildCtx.isActiveBuild) {
      // rollup errored, so let's not continue
      return undefined;
    }

    const [esm, amd] = await Promise.all([
      // [0] bundle using only es modules and dynamic imports
      await writeEsmModules(config, rollupBundle),

      // [1] bundle using commonjs using jsonp callback
      await writeAmdModules(config, rollupBundle, entryModules),
    ]);

    if (buildCtx.hasError || !buildCtx.isActiveBuild) {
      // someone could have errored
      return undefined;
    }

    return {
      esm,
      amd
    };

  } catch (err) {
    catchError(buildCtx.diagnostics, err);
  }

  return undefined;
}
