import * as d from '../../../declarations';
import { buildError } from '@utils';
import { VALID_TYPES_NEXT } from '../../../compiler/output-targets/output-utils';
import { validateCollection } from './validate-collection';
import { validateCustomElement } from './validate-custom-element';
import { validateLazy } from './validate-lazy';
import { validateWww } from './validate-www';
import { validateDist } from './validate-dist';


export function validateOutputTargets(config: d.Config, diagnostics: d.Diagnostic[]) {
  const userOutputs = (config.outputTargets || []).slice();

  userOutputs.forEach(outputTarget => {
    if (!VALID_TYPES_NEXT.includes(outputTarget.type)) {
      const err = buildError(diagnostics);
      err.messageText = `Invalid outputTarget type "${outputTarget.type}". Valid outputTarget types include: ${VALID_TYPES_NEXT.map(t => `"${t}"`).join(', ')}`;
    }
  });
  if (!config.outputTargets) {
    config.outputTargets = [];
  }

  config.outputTargets = [
    ...validateCollection(config, diagnostics),
    ...validateCustomElement(config, diagnostics),
    ...validateLazy(config, diagnostics),
    ...validateWww(config, diagnostics),
    ...validateDist(config, diagnostics),
  ];
}
