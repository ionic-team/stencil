import * as d from '../../../declarations';
import { buildError } from '@utils';
import { VALID_TYPES_NEXT, isOutputTargetCollectionNext, isOutputTargetCustomElementNext, isOutputTargetLazyNext } from '../../../compiler/output-targets/output-utils';
import { validateCollection } from './validate-collection';
import { validateCustomElement } from './validate-custom-element';
import { validateLazy } from './validate-lazy';


export function validateOutputTargets(config: d.Config, diagnostics: d.Diagnostic[]) {
  const userOutputs = (config.outputTargets || []).slice();

  userOutputs.forEach(outputTarget => {
    if (!VALID_TYPES_NEXT.includes(outputTarget.type)) {
      const err = buildError(diagnostics);
      err.messageText = `invalid outputTarget type "${outputTarget.type}". Valid outputTarget types include: ${VALID_TYPES_NEXT.map(t => `"${t}"`).join(', ')}`;
    }
  });

  config.outputTargets = [
    ...validateCollection(config, userOutputs.filter(isOutputTargetCollectionNext), diagnostics),
    ...validateCustomElement(config, userOutputs.filter(isOutputTargetCustomElementNext), diagnostics),
    ...validateLazy(config, userOutputs.filter(isOutputTargetLazyNext), diagnostics)
  ];
}
