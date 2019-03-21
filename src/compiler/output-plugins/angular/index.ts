import { Config, Plugin } from '../../../declarations';
import { normalizePath } from './utils';
import { angularDirectiveProxyOutput } from './output-angular';
import { OutputTargetAngular } from './types';
import path from 'path';

export const plugin: Plugin<OutputTargetAngular> = {
  name: 'angular',
  validate(outputTarget, config) {
    return normalizeOutputTarget(config, outputTarget);
  },
  async createOutput(outputTargets, _config, compilerCtx, buildCtx) {
    const timespan = buildCtx.createTimeSpan(`generate angular proxies started`, true);

    await Promise.all(
      outputTargets.map(outputTarget => angularDirectiveProxyOutput(compilerCtx, outputTarget, buildCtx.moduleFiles))
    );

    timespan.finish(`generate angular proxies finished`);
  }
};


function normalizeOutputTarget(config: Config, outputTarget: any) {
  const results: OutputTargetAngular = {
    ...outputTarget,
    excludeComponents: outputTarget.excludeComponents || []
  };

  if (outputTarget.directivesProxyFile && !path.isAbsolute(outputTarget.directivesProxyFile)) {
    results.directivesProxyFile = normalizePath(path.join(config.rootDir, outputTarget.directivesProxyFile));
  }

  if (outputTarget.directivesArrayFile && !path.isAbsolute(outputTarget.directivesArrayFile)) {
    results.directivesArrayFile = normalizePath(path.join(config.rootDir, outputTarget.directivesArrayFile));
  }

  if (outputTarget.directivesUtilsFile && !path.isAbsolute(outputTarget.directivesUtilsFile)) {
    results.directivesUtilsFile = normalizePath(path.join(config.rootDir, outputTarget.directivesUtilsFile));
  }

  return results;
}
