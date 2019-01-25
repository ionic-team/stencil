import * as d from '@declarations';
import { sys } from '@sys';


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

  const promises: Promise<any>[] = [];

  buildCtx.moduleFiles.forEach(moduleFile => {
    moduleFile.cmps.forEach(cmp => {
      promises.push(
        generateCollection(config, compilerCtx, outputTargets, moduleFile, cmp)
      );
    });
  });

  await Promise.all(promises);

  timespan.finish(`generate collections finished`);
}


async function generateCollection(config: d.Config, compilerCtx: d.CompilerCtx, outputTargets: d.OutputTargetDist[], moduleFile: d.Module, cmp: d.ComponentCompilerMeta) {
  const relPath = sys.path.relative(config.srcDir, moduleFile.jsFilePath);
  const jsText = await compilerCtx.fs.readFile(moduleFile.jsFilePath);

  const promises = outputTargets.map(async outputTarget => {
    await writeCollectionOutput(compilerCtx, outputTarget, cmp, relPath, jsText);
  });

  await Promise.all(promises);
}


async function writeCollectionOutput(compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist, _cmp: d.ComponentCompilerMeta, relPath: string, outputText: string) {
  const outputFilePath = sys.path.join(outputTarget.collectionDir, relPath);

  await compilerCtx.fs.writeFile(outputFilePath, outputText);
}
