import type * as d from '../../../declarations';
import { buildError } from '@utils';
import { VALID_TYPES } from '../../output-targets/output-utils';
import { validateCollection } from './validate-collection';
import { validateCustomElement } from './validate-custom-element';
import { validateCustomOutput } from './validate-custom-output';
import { validateDist } from './validate-dist';
import { validateDocs } from './validate-docs';
import { validateAngular } from './validate-angular';
import { validateHydrateScript } from './validate-hydrate-script';
import { validateLazy } from './validate-lazy';
import { validateStats } from './validate-stats';
import { validateWww } from './validate-www';
import { validateCustomElementBundle } from './validate-custom-element-bundle';

export const validateOutputTargets = (config: d.Config, diagnostics: d.Diagnostic[]) => {
  const userOutputs = (config.outputTargets || []).slice();

  userOutputs.forEach(outputTarget => {
    if (!VALID_TYPES.includes(outputTarget.type)) {
      const err = buildError(diagnostics);
      err.messageText = `Invalid outputTarget type "${
        outputTarget.type
      }". Valid outputTarget types include: ${VALID_TYPES.map(t => `"${t}"`).join(', ')}`;
    }
  });

  config.outputTargets = [
    ...validateCollection(config, userOutputs),
    ...validateCustomElement(config, userOutputs),
    ...validateCustomElementBundle(config, userOutputs),
    ...validateCustomOutput(config, diagnostics, userOutputs),
    ...validateLazy(config, userOutputs),
    ...validateWww(config, diagnostics, userOutputs),
    ...validateDist(config, userOutputs),
    ...validateDocs(config, diagnostics, userOutputs),
    ...validateAngular(config, userOutputs),
    ...validateStats(config, userOutputs),
  ];

  // hydrate also gets info from the www output
  config.outputTargets = [
    ...config.outputTargets,
    ...validateHydrateScript(config, [...userOutputs, ...config.outputTargets]),
  ];
};
