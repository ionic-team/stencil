import * as d from '../../declarations';
import { DIST_HYDRATE_SCRIPT, isOutputTargetDist, isOutputTargetHydrate, isOutputTargetWww } from '../output-targets/output-utils';


export function validateOutputTargetDistHydrateScript(config: d.Config) {
  const hasHydrateOutputTarget = config.outputTargets.some(isOutputTargetHydrate);

  if (hasHydrateOutputTarget === false) {
    // we don't already have a hydrate output target
    // let's still see if we require one because of other output targets

    const hasWwwOutput = config.outputTargets
      .filter(isOutputTargetWww)
      .some(o => typeof o.indexHtml === 'string');

    if (hasWwwOutput && config.flags && config.flags.prerender) {
      // we're prerendering a www output target, so we'll need a hydrate app
      let hydrateDir: string;
      const distOutput = config.outputTargets.find(isOutputTargetDist);
      if (distOutput != null && typeof distOutput.dir === 'string') {
        hydrateDir = config.sys.path.join(distOutput.dir, 'hydrate');
      } else {
        hydrateDir = 'dist/hydrate';
      }

      const hydrateForWwwOutputTarget: d.OutputTargetHydrate = {
        type: DIST_HYDRATE_SCRIPT,
        dir: hydrateDir
      };
      config.outputTargets.push(hydrateForWwwOutputTarget);
    }
  }

  const hydrateOutputTargets = config.outputTargets
    .filter(isOutputTargetHydrate);

  hydrateOutputTargets.forEach(outputTarget => {
    if (typeof outputTarget.dir !== 'string') {
      // no directory given, see if we've got a dist to go off of
      outputTarget.dir = 'hydrate';
    }

    if (!config.sys.path.isAbsolute(outputTarget.dir)) {
      outputTarget.dir = config.sys.path.join(config.rootDir, outputTarget.dir);
    }

    if (typeof outputTarget.empty !== 'boolean') {
      outputTarget.empty = true;
    }
  });
}
