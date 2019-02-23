import * as d from '@declarations';
import { isOutputTargetDist, isOutputTargetHydrate, isOutputTargetWww } from '../output-targets/output-utils';
import { sys } from '@sys';


export function validateOutputTargetHydrate(config: d.Config) {
  const hasHydrateOutputTarget = config.outputTargets.some(isOutputTargetHydrate);

  if (hasHydrateOutputTarget === false) {
    // we don't already have a hydrate output target
    // let's still see if we require one because of other output targets

    const wwwIndexOutputTargets = config.outputTargets
      .filter(isOutputTargetWww)
      .filter(o => typeof o.indexHtml === 'string');

    if (wwwIndexOutputTargets.length > 0 && config.flags && config.flags.prerender) {
      // we're prerendering a www output target, so we'll need a hydrate app
      wwwIndexOutputTargets.forEach(wwwIndexOutputTarget => {
        // create a default dist directory in case there isn't one already
        let hydrateAppDir = sys.path.join(wwwIndexOutputTarget.dir, '..', 'dist', 'server');

        const distOutputTarget = config.outputTargets.find(isOutputTargetDist);
        if (distOutputTarget != null) {
          // use this location instead if there is a dist output target
          hydrateAppDir = sys.path.join(distOutputTarget.dir, 'server');
        }

        const hydrateForWwwOutputTarget: d.OutputTargetHydrate = {
          type: 'hydrate',
          dir: hydrateAppDir
        };
        config.outputTargets.push(hydrateForWwwOutputTarget);
      });
    }
  }


  const hydrateOutputTargets = config.outputTargets
    .filter(isOutputTargetHydrate);

  hydrateOutputTargets.forEach(outputTarget => {
    if (!sys.path.isAbsolute(outputTarget.dir)) {
      outputTarget.dir = sys.path.join(config.rootDir, outputTarget.dir);
    }
  });
}
