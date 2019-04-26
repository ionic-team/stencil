import * as d from '../../declarations';
import { generateComponentStylesMode } from './component-styles';
import { generateGlobalStyles } from './global-styles';
import { isOutputTargetHydrate } from '../output-targets/output-utils';


export async function generateStyles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (canSkipGenerateStyles(compilerCtx, buildCtx)) {
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


function canSkipGenerateStyles(compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
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
      const hasChangedComponent = buildCtx.filesChanged
        .filter(filePath => {
          // get all the changed scripts
          return filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.jsx');
        })
        .some(filePath => {
          // see if any of the changed scripts are module files
          const moduleFile = compilerCtx.moduleMap.get(filePath);
          if (moduleFile != null && moduleFile.cmps != null) {
            return moduleFile.cmps.some(cmp => cmp.hasStyle);
          }
          // not a module with a component
          return false;
        });
      return !hasChangedComponent;
    }

    // cool! There were no changes to any style files
    // and there were no changes to any scripts that
    // contain components with styles! SKIP
    // ♪┏(・o･)┛♪┗ ( ･o･) ┓♪
    return true;
  }

  return false;
}
