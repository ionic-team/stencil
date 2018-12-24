import * as d from '../../declarations';
import { generateAppCore } from '../app-core/generate-app-core';
import { getBuildFeatures, updateBuildConditionals } from '../app-core/build-conditionals';
import { pathJoin } from '../util';


export async function generateWebComponents(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (!buildCtx.requiresFullBuild && buildCtx.isRebuild && !buildCtx.hasScriptChanges) {
    return;
  }

  const outputTargets = (config.outputTargets as d.OutputTargetWebComponent[]).filter(o => {
    return o.type === 'webcomponent';
  });

  if (outputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate web components started`, true);

  const moduleFiles = buildCtx.moduleFiles.filter(m => m.cmpCompilerMeta);

  const promises = moduleFiles.map(async moduleFile => {
    return generateWebcomponent(config, compilerCtx, buildCtx, outputTargets, buildCtx.moduleFiles, moduleFile);
  });

  await Promise.all(promises);

  timespan.finish(`generate web components finished`);
}


async function generateWebcomponent(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetWebComponent[], allModuleFiles: d.Module[], moduleFile: d.Module) {
  const timespan = buildCtx.createTimeSpan(`generate web component started: ${moduleFile.cmpCompilerMeta.tagName}`, true);

  const build = getBuildFeatures(allModuleFiles, [moduleFile]) as d.Build;

  build.lazyLoad = false;
  build.es5 = false;
  build.slotPolyfill = false;
  build.polyfills = false;
  build.prerenderClientSide = false;
  build.prerenderServerSide = false;

  updateBuildConditionals(config, build);

  const outputText = await generateAppCore(config, compilerCtx, buildCtx, build);

  if (!buildCtx.hasError && typeof outputText === 'string') {
    const promises = outputTargets.map(async outputTarget => {
      await writeWebComponentOutput(config, compilerCtx, outputTarget, moduleFile.cmpCompilerMeta, outputText);
    });
    await Promise.all(promises);

    timespan.finish(`generate web component finished: ${moduleFile.cmpCompilerMeta.tagName}`);
  }
}


async function writeWebComponentOutput(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetWebComponent, cmpCompilerMeta: d.ComponentCompilerMeta, outputText: string) {
  const fileName = `${cmpCompilerMeta.tagName}.js`;
  const filePath = pathJoin(config, outputTarget.dir, fileName);

  await compilerCtx.fs.writeFile(filePath, outputText);
}
