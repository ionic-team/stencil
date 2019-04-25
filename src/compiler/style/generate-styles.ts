import * as d from '../../declarations';
import { generateComponentStylesMode } from './component-styles';
import { generateGlobalStyles } from './global-styles';
import { isOutputTargetHydrate } from '../output-targets/output-utils';


export async function generateStyles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (canSkipGenerateStyles(buildCtx)) {
    return;
  }

  const timeSpan = buildCtx.createTimeSpan(`generate styles started`);

  await Promise.all([
    generateGlobalStyles(config, compilerCtx, buildCtx, config.globalStyle),
    generateComponentStyles(config, compilerCtx, buildCtx),
  ]);

  timeSpan.finish(`generate styles finished`);
}


export function generateComponentStyles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  const commentOriginalSelector = config.outputTargets.some(isOutputTargetHydrate);

  return Promise.all(
    buildCtx.components.map(cmp => {
      return Promise.all(cmp.styles.map(style => {
        return generateComponentStylesMode(config, compilerCtx, buildCtx, cmp, style, style.modeName, commentOriginalSelector);
      }));
  }));
}


function canSkipGenerateStyles(buildCtx: d.BuildCtx) {
  if (buildCtx.requiresFullBuild) {
    return false;
  }

  if (buildCtx.isRebuild) {
    if (buildCtx.hasStyleChanges || buildCtx.hasScriptChanges) {
      // this is a rebuild and there are style or script changes
      // changes to scripts are important too because it could be
      // a change to the style url or style text
      return false;
    }

    return true;
  }

  return false;
}
