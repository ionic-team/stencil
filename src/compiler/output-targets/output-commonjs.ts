import * as d from '@declarations';
import { sys } from '@sys';


export async function generateCommonJsIndexes(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (!buildCtx.requiresFullBuild && buildCtx.isRebuild && !buildCtx.hasScriptChanges) {
    return;
  }

  const outputsTargets = (config.outputTargets as d.OutputTargetDist[]).filter(o => {
    return o.type === 'dist';
  });

  if (outputsTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate commonjs started`, true);

  const promises = outputsTargets.map(outputsTarget => {
    return generateCommonJsIndex(config, compilerCtx, outputsTarget);
  });

  await Promise.all(promises);

  timespan.finish(`generate commonjs finished`);
}


function generateCommonJsIndex(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist) {
  const outputText = `// ${config.namespace}: CommonJS Main`;

  return writeCommonJsOutput(compilerCtx, outputTarget, outputText);
}


function writeCommonJsOutput(compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist, outputText: string) {
  const distIndexCjsPath = sys.path.join(outputTarget.buildDir, 'index.js');

  return compilerCtx.fs.writeFile(distIndexCjsPath, outputText);
}
