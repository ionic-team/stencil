import * as d from '../../declarations';
import { pathJoin } from '@stencil/core/utils';


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

  const promises = outputsTargets.map(async outputsTarget => {
    await generateCommonJsIndex(config, compilerCtx, outputsTarget);
  });

  await Promise.all(promises);

  timespan.finish(`generate commonjs finished`);
}


async function generateCommonJsIndex(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist) {
  const outputText = `// ${config.namespace}: CommonJS Main`;

  await writeCommonJsOutput(config, compilerCtx, outputTarget, outputText);
}


async function writeCommonJsOutput(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist, outputText: string) {
  const distIndexCjsPath = pathJoin(config, outputTarget.buildDir, 'index.js');

  await compilerCtx.fs.writeFile(distIndexCjsPath, outputText);
}
