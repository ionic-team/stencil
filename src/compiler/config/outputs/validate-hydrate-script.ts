import type * as d from '../../../declarations';
import {
  DIST_HYDRATE_SCRIPT,
  isOutputTargetDist,
  isOutputTargetHydrate,
  isOutputTargetWww,
} from '../../output-targets/output-utils';
import { isBoolean, isString } from '@utils';
import { isAbsolute, join } from 'path';
import { NODE_BUILTINS } from '../../sys/modules';

export const validateHydrateScript = (config: d.ValidatedConfig, userOutputs: d.OutputTarget[]) => {
  const output: d.OutputTargetHydrate[] = [];

  const hasHydrateOutputTarget = userOutputs.some(isOutputTargetHydrate);

  if (!hasHydrateOutputTarget) {
    // we don't already have a hydrate output target
    // let's still see if we require one because of other output targets

    const hasWwwOutput = userOutputs.filter(isOutputTargetWww).some((o) => isString(o.indexHtml));
    const shouldBuildHydrate = config.flags.prerender || config.flags.ssr;

    if (hasWwwOutput && shouldBuildHydrate) {
      // we're prerendering a www output target, so we'll need a hydrate app
      let hydrateDir: string;
      const distOutput = userOutputs.find(isOutputTargetDist);
      if (distOutput != null && isString(distOutput.dir)) {
        hydrateDir = join(distOutput.dir, 'hydrate');
      } else {
        hydrateDir = 'dist/hydrate';
      }

      const hydrateForWwwOutputTarget: d.OutputTargetHydrate = {
        type: DIST_HYDRATE_SCRIPT,
        dir: hydrateDir,
      };
      userOutputs.push(hydrateForWwwOutputTarget);
    }
  }

  const hydrateOutputTargets = userOutputs.filter(isOutputTargetHydrate);

  hydrateOutputTargets.forEach((outputTarget) => {
    if (!isString(outputTarget.dir)) {
      // no directory given, see if we've got a dist to go off of
      outputTarget.dir = 'hydrate';
    }

    if (!isAbsolute(outputTarget.dir)) {
      outputTarget.dir = join(config.rootDir, outputTarget.dir);
    }

    if (!isBoolean(outputTarget.empty)) {
      outputTarget.empty = true;
    }

    outputTarget.external = outputTarget.external || [];

    outputTarget.external.push(...NODE_BUILTINS);

    output.push(outputTarget);
  });

  return output;
};
