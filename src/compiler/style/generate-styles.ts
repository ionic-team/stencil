import * as d from '../../declarations';
import { generateComponentStylesModes } from './generate-component-styles';
import { generateGlobalStyles } from './global-styles';


export async function generateStyles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, entryModules: d.EntryModule[]) {
  if (canSkipGenerateStyles(buildCtx)) {
    return;
  }

  const timeSpan = buildCtx.createTimeSpan(`generate styles started`);

  const componentStyles = await Promise.all(entryModules.map(async bundle => {
    await Promise.all(bundle.moduleFiles.map(async moduleFile => {
      await generateComponentStyles(config, compilerCtx, buildCtx, moduleFile);
    }));
  }));

  // create the global styles
  const globalStyles = await Promise.all(config.outputTargets
    .filter(outputTarget => outputTarget.type !== 'stats')
    .map(async outputTarget => {
      await generateGlobalStyles(config, compilerCtx, buildCtx, outputTarget);
    }));

  await Promise.all([
    componentStyles,
    globalStyles
  ]);

  timeSpan.finish(`generate styles finished`);
}


export async function generateComponentStyles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, moduleFile: d.ModuleFile) {
  const stylesMeta = moduleFile.cmpMeta.stylesMeta = moduleFile.cmpMeta.stylesMeta || {};

  await Promise.all(Object.keys(stylesMeta).map(async modeName => {
    if (buildCtx.hasError || !buildCtx.isActiveBuild) {
      return;
    }

    await generateComponentStylesModes(config, compilerCtx, buildCtx, moduleFile, stylesMeta, modeName);
  }));
}


function canSkipGenerateStyles(buildCtx: d.BuildCtx) {
  if (buildCtx.hasError || !buildCtx.isActiveBuild) {
    return true;
  }

  if (buildCtx.requiresFullBuild) {
    return false;
  }

  if (buildCtx.isRebuild) {
    if (buildCtx.hasScriptChanges || buildCtx.hasStyleChanges) {
      return false;
    }

    return true;
  }

  return false;
}
