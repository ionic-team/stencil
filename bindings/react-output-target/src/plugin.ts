import { Config, OutputTargetCustom } from '@stencil/core/internal';
import { normalizePath } from './utils';
import { OutputTargetReact } from './types';
import { reactProxyOutput } from './output-react';
import path from 'path';

export const reactOutputTarget = (outputTarget: OutputTargetReact): OutputTargetCustom => ({
  type: 'custom',
  name: 'react-library',
  validate(config) {
    return normalizeOutputTarget(config, outputTarget);
  },
  async generator(config, compilerCtx, buildCtx) {
    const timespan = buildCtx.createTimeSpan(`generate react started`, true);

    await reactProxyOutput(compilerCtx, outputTarget, buildCtx.components, config);

    timespan.finish(`generate react finished`);
  }
});


function normalizeOutputTarget(config: Config, outputTarget: any) {
  const results: OutputTargetReact = {
    ...outputTarget,
    excludeComponents: outputTarget.excludeComponents || []
  };

  if (config.rootDir == null) {
    throw new Error('rootDir is not set and it should be set by stencil itself');
  }
  if (outputTarget.proxiesFile == null) {
    throw new Error('proxiesFile is required');
  }

  if (outputTarget.directivesProxyFile && !path.isAbsolute(outputTarget.directivesProxyFile)) {
    results.proxiesFile = normalizePath(path.join(config.rootDir, outputTarget.proxiesFile));
  }

  return results;
}
