import * as d from '../../declarations';
import { normalizePath } from '../util';


export function validateOutputTargetAngular(config: d.Config) {
  const path = config.sys.path;

  const distOutputTargets = (config.outputTargets as d.OutputTargetAngular[]).filter(o => o.type === 'angular');

  distOutputTargets.forEach(outputTarget => {
    outputTarget.excludeComponents = outputTarget.excludeComponents || [];

    if (typeof outputTarget.appBuild !== 'boolean') {
      outputTarget.appBuild = true;
    }

    if (!outputTarget.dir) {
      outputTarget.dir = DEFAULT_DIR;
    }

    if (!path.isAbsolute(outputTarget.dir)) {
      outputTarget.dir = normalizePath(path.join(config.rootDir, outputTarget.dir));
    }

    if (!outputTarget.buildDir) {
      outputTarget.buildDir = DEFAULT_BUILD_DIR;
    }

    if (!path.isAbsolute(outputTarget.buildDir)) {
      outputTarget.buildDir = normalizePath(path.join(outputTarget.dir, outputTarget.buildDir));
    }

    if (!outputTarget.typesDir) {
      outputTarget.typesDir = DEFAULT_TYPES_DIR;
    }

    if (!path.isAbsolute(outputTarget.typesDir)) {
      outputTarget.typesDir = normalizePath(path.join(outputTarget.dir, outputTarget.typesDir));
    }

    if (typeof outputTarget.empty !== 'boolean') {
      outputTarget.empty = DEFAULT_EMPTY_DIR;
    }

    if (typeof outputTarget.appBuild !== 'boolean') {
      outputTarget.appBuild = true;
    }

    if (!path.isAbsolute(outputTarget.directivesProxyFile)) {
      outputTarget.directivesProxyFile = normalizePath(path.join(config.rootDir, outputTarget.directivesProxyFile));
    }
  });
}

const DEFAULT_DIR = 'dist';
const DEFAULT_BUILD_DIR = '';
const DEFAULT_EMPTY_DIR = true;
const DEFAULT_TYPES_DIR = 'types';
