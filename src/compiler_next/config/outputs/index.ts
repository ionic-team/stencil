import * as d from '../../../declarations';
import { buildError } from '@utils';
import { VALID_TYPES_NEXT } from '../../output-targets/output-utils';
import { validateCollection } from './validate-collection';
import { validateCustomElement } from './validate-custom-element';
import { validateCustomOutput } from './validate-custom-output';
import { validateDist } from './validate-dist';
import { validateDocs } from './validate-docs';
import { validateHydrateScript } from './validate-hydrate-script';
import { validateLazy } from './validate-lazy';
import { validateWww } from './validate-www';
import { validateCustomElementBundle } from './validate-custom-element-bundle';

export const validateOutputTargets = (config: d.Config, diagnostics: d.Diagnostic[]) => {
  const userOutputs = (config.outputTargets || []).slice();

  userOutputs.forEach(outputTarget => {
    if (!VALID_TYPES_NEXT.includes(outputTarget.type)) {
      const err = buildError(diagnostics);
      err.messageText = `Invalid outputTarget type "${outputTarget.type}". Valid outputTarget types include: ${VALID_TYPES_NEXT.map(t => `"${t}"`).join(', ')}`;
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
    ...validateHydrateScript(config, userOutputs),
    ...validateDocs(config, diagnostics, userOutputs),
  ];
};
