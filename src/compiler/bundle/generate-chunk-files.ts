import * as d from '../../declarations';
import { getAppBuildDir, getDistEsmComponentsDir } from '../app/app-file-naming';
import { pathJoin } from '../util';
import { replaceBundleIdPlaceholder } from '../../util/data-serialize';


export async function generateChunkFiles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, derivedModule: d.DerivedModule) {
  if (buildCtx.shouldAbort) {
    return;
  }

  const timeSpan = buildCtx.createTimeSpan(`generateChunkFiles started`, true);

  const entryModulesMap = new Map<string, d.EntryModule>();
  buildCtx.entryModules.forEach(e => entryModulesMap.set(e.entryKey, e));

  const esmPromises = derivedModule.list
    .filter(chunk => !entryModulesMap.has(chunk.entryKey))
    .map(async chunk => {
      // chunk asset, not a entry point, just write to the final destination
      if (derivedModule.isBrowser) {
        const fileName = `${chunk.entryKey}${derivedModule.sourceTarget === 'es5' ? '.es5' : ''}.js`;
        const jsText = replaceBundleIdPlaceholder(chunk.code, chunk.filename);
        await writeBrowserJSFile(config, compilerCtx, fileName, jsText);

      } else {
        await writeEsmJSFile(config, compilerCtx, derivedModule.sourceTarget, chunk.filename, chunk.code);
      }
    });

  await Promise.all(esmPromises);

  timeSpan.finish(`generateBrowserEsm finished`);
}


async function writeBrowserJSFile(config: d.Config, compilerCtx: d.CompilerCtx, fileName: string, jsText: string) {
  const outputTargets = config.outputTargets.filter(outputTarget => outputTarget.appBuild) as d.OutputTargetBuild[];

  await Promise.all(outputTargets.map(async outputTarget => {
    // get the absolute path to where it'll be saved in www
    const buildPath = pathJoin(config, getAppBuildDir(config, outputTarget), fileName);

    // write to the build dir
    await compilerCtx.fs.writeFile(buildPath, jsText);
  }));
}


async function writeEsmJSFile(config: d.Config, compilerCtx: d.CompilerCtx, sourceTarget: d.SourceTarget, fileName: string, jsText: string) {
  const outputTargets = config.outputTargets.filter(outputTarget => outputTarget.type === 'dist') as d.OutputTargetDist[];

  const promises = outputTargets.map(async outputTarget => {
    // get the absolute path to where it'll be saved in www
    const buildPath = pathJoin(config, getDistEsmComponentsDir(config, outputTarget, sourceTarget), fileName);

    // write to the build dir
    await compilerCtx.fs.writeFile(buildPath, jsText);
  });

  await Promise.all(promises);
}
