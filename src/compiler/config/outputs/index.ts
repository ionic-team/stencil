import type * as d from '../../../declarations';
import { buildError, buildWarn } from '@utils';
import {
  DIST_CUSTOM_ELEMENTS_BUNDLE,
  isValidConfigOutputTarget,
  VALID_CONFIG_OUTPUT_TARGETS,
} from '../../output-targets/output-utils';
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

export const validateOutputTargets = (config: d.ValidatedConfig, diagnostics: d.Diagnostic[]) => {
  const userOutputs = (config.outputTargets || []).slice();

  userOutputs.forEach((outputTarget) => {
    if (!isValidConfigOutputTarget(outputTarget.type)) {
      const err = buildError(diagnostics);
      err.messageText = `Invalid outputTarget type "${
        outputTarget.type
      }". Valid outputTarget types include: ${VALID_CONFIG_OUTPUT_TARGETS.map((t) => `"${t}"`).join(', ')}`;
    } else if (outputTarget.type === DIST_CUSTOM_ELEMENTS_BUNDLE) {
      // TODO(STENCIL-260): Remove this check when the 'dist-custom-elements-bundle' is removed
      const warning = buildWarn(diagnostics);
      warning.messageText = `dist-custom-elements-bundle is deprecated and will be removed in a future major version release. Use "dist-custom-elements" instead. If "dist-custom-elements" does not meet your needs, please add a comment to https://github.com/ionic-team/stencil/issues/3136.`;
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
