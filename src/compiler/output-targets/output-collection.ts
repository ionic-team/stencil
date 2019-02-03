import * as d from '@declarations';
import { sys } from '@sys';


export async function outputCollections(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (!buildCtx.requiresFullBuild && buildCtx.isRebuild && !buildCtx.hasScriptChanges) {
    return;
  }

  const outputTargets = (config.outputTargets as d.OutputTargetDist[]).filter(o => {
    return (o.type === 'dist' && o.collectionDir);
  });

  if (outputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate collections started`, true);

  await Promise.all(buildCtx.moduleFiles.map(moduleFile => {
    return Promise.all(moduleFile.cmps.map(cmp => {
      return generateCollection(config, compilerCtx, outputTargets, moduleFile, cmp);
    }));
  }));

  timespan.finish(`generate collections finished`);
}


async function generateCollection(config: d.Config, compilerCtx: d.CompilerCtx, outputTargets: d.OutputTargetDist[], moduleFile: d.Module, cmp: d.ComponentCompilerMeta) {
  const relPath = sys.path.relative(config.srcDir, moduleFile.jsFilePath);
  const jsText = await compilerCtx.fs.readFile(moduleFile.jsFilePath);

  const promises = outputTargets.map(outputTarget => {
    return writeCollectionOutput(compilerCtx, outputTarget, cmp, relPath, jsText);
  });

  return Promise.all(promises);
}


function writeCollectionOutput(compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist, _cmp: d.ComponentCompilerMeta, relPath: string, outputText: string) {
  const outputFilePath = sys.path.join(outputTarget.collectionDir, relPath);

  return compilerCtx.fs.writeFile(outputFilePath, outputText);
}
