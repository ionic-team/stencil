import * as d from '../../declarations';
import { pathJoin } from '@stencil/core/utils';


export async function generateCollections(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (!buildCtx.requiresFullBuild && buildCtx.isRebuild && !buildCtx.hasScriptChanges) {
    return;
  }

  const outputTargets = (config.outputTargets as d.OutputTargetDist[]).filter(o => {
    return o.type === 'dist' && o.collectionDir;
  });

  if (outputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate collections started`, true);

  const cmpModuleFiles = buildCtx.moduleFiles.filter(m => m.cmpCompilerMeta);

  const promises = cmpModuleFiles.map(async cmpModuleFile => {
    await generateCollection(config, compilerCtx, outputTargets, cmpModuleFile);
  });

  await Promise.all(promises);

  timespan.finish(`generate collections finished`);
}


async function generateCollection(config: d.Config, compilerCtx: d.CompilerCtx, outputTargets: d.OutputTargetDist[], cmpModuleFile: d.Module) {
  const relPath = config.sys.path.relative(config.srcDir, cmpModuleFile.jsFilePath);
  const jsText = await compilerCtx.fs.readFile(cmpModuleFile.jsFilePath);

  const promises = outputTargets.map(async outputTarget => {
    await writeCollectionOutput(config, compilerCtx, outputTarget, relPath, jsText);
  });

  await Promise.all(promises);
}


async function writeCollectionOutput(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist, relPath: string, outputText: string) {
  const outputFilePath = pathJoin(config, outputTarget.collectionDir, relPath);

  await compilerCtx.fs.writeFile(outputFilePath, outputText);
}
