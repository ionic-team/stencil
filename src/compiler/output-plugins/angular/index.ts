import * as d from '../../../declarations';
import { normalizePath } from '@utils';
import { angularDirectiveProxyOutput } from './output-angular';
import { OutputTargetAngular } from './types';

export const plugin: d.Plugin<OutputTargetAngular> = {
  name: 'angular',
  validate(outputTarget, config) {
    return normalizeOutputTarget(config, outputTarget);
  },
  async createOutput(outputTargets, config, compilerCtx, buildCtx) {
    const timespan = buildCtx.createTimeSpan(`generate angular proxies started`, true);

    await Promise.all(
      outputTargets.map(outputTarget => angularDirectiveProxyOutput(config, compilerCtx, outputTarget, buildCtx.moduleFiles))
    );

    timespan.finish(`generate angular proxies finished`);
  }
};


function normalizeOutputTarget(config: d.Config, outputTarget: any) {
  const path = config.sys.path;

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
