import * as d from '@declarations';
import { generateComponentStylesMode } from './component-styles';
import { generateGlobalStyles } from './global-styles';


export async function generateStyles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (canSkipGenerateStyles(buildCtx)) {
    return;
  }

  const timeSpan = buildCtx.createTimeSpan(`generate styles started`);

  const componentStyles = await Promise.all(buildCtx.moduleFiles.map(async moduleFile => {
    await Promise.all(moduleFile.cmps.map(async cmps => {
      await generateComponentStyles(config, compilerCtx, buildCtx, moduleFile, cmps);
    }));
  }));

  // create the global styles
  const globalStyles = await Promise.all(config.outputTargets
    .filter(outputTarget => outputTarget.type !== 'stats')
    .map(async (outputTarget: d.OutputTargetBuild) => {
      await generateGlobalStyles(config, compilerCtx, buildCtx, outputTarget);
    }));

  await Promise.all([
    componentStyles,
    globalStyles
  ]);

  timeSpan.finish(`generate styles finished`);
}


export async function generateComponentStyles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, moduleFile: d.Module, cmp: d.ComponentCompilerMeta) {
  await Promise.all(cmp.styles.map(async style => {
    await generateComponentStylesMode(config, compilerCtx, buildCtx, moduleFile, cmp, style, style.modeName);
  }));
}


function canSkipGenerateStyles(buildCtx: d.BuildCtx) {
  if (buildCtx.shouldAbort) {
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
