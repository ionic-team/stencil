import * as d from '../../declarations';
import { generateComponentStylesMode } from './component-styles';
import { generateGlobalStyles } from './global-styles';
import { isOutputTargetHydrate, isOutputTargetWww } from '../output-targets/output-utils';


export async function generateStyles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (canSkipGenerateStyles(buildCtx)) {
    return;
  }

  const timeSpan = buildCtx.createTimeSpan(`generate styles started`);

  const commentOriginalSelector = config.outputTargets.some(isOutputTargetHydrate);

  const componentStyles = await Promise.all(
    buildCtx.components.map(cmp => {
      generateComponentStyles(config, compilerCtx, buildCtx, cmp, commentOriginalSelector);
    })
  );

  // create the global styles
  const globalStyles = await Promise.all(
    config.outputTargets
      .filter(isOutputTargetWww)
      .map(outputTarget => generateGlobalStyles(config, compilerCtx, buildCtx, outputTarget))
  );

  await Promise.all([
    componentStyles,
    globalStyles
  ]);

  timeSpan.finish(`generate styles finished`);
}


export async function generateComponentStyles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, cmp: d.ComponentCompilerMeta, commentOriginalSelector: boolean) {
  await Promise.all(cmp.styles.map(async style => {
    await generateComponentStylesMode(config, compilerCtx, buildCtx, cmp, style, style.modeName, commentOriginalSelector);
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
    if (buildCtx.hasStyleChanges) {
      return false;
    }

    return true;
  }

  return false;
}
