import * as d from '../../declarations';
import { generateComponentStyles } from './component-styles';
import { generateGlobalStyles } from './global-styles';
import { updateLastStyleComponetInputs } from './cached-styles';


export async function generateStyles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (canSkipGenerateStyles(buildCtx)) {
    return;
  }

  const timeSpan = buildCtx.createTimeSpan(`generate styles started`);

  await Promise.all([
    generateGlobalStyles(config, compilerCtx, buildCtx),
    generateComponentStyles(config, compilerCtx, buildCtx),
  ]);

  await updateLastStyleComponetInputs(config, compilerCtx, buildCtx);

  timeSpan.finish(`generate styles finished`);
}


function canSkipGenerateStyles(buildCtx: d.BuildCtx) {
  if (buildCtx.components.length === 0) {
    return true;
  }

  if (buildCtx.requiresFullBuild) {
    return false;
  }

  if (buildCtx.isRebuild) {
    if (buildCtx.hasStyleChanges) {
      // this is a rebuild and there are style changes
      return false;
    }

    if (buildCtx.hasScriptChanges) {
      // this is a rebuild and there are script changes
      // changes to scripts are important too because it could be
      // a change to the style url or style text in the component decorator
      return false;
    }

    // cool! There were no changes to any style files
    // and there were no changes to any scripts that
    // contain components with styles! SKIP
    // ♪┏(・o･)┛♪┗ ( ･o･) ┓♪
    return true;
  }

  return false;
}
