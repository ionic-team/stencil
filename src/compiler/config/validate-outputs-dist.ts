import { Config } from '../../declarations';
import { normalizePath } from '../util';


export function validateDistOutputTarget(config: Config) {
  const path = config.sys.path;

  const distOutputTargets = config.outputTargets.filter(o => o.type === 'dist');

  distOutputTargets.forEach(outputTarget => {
    if (!outputTarget.path) {
      outputTarget.path = DEFAULT_DIST_DIR;
    }

    if (!path.isAbsolute(outputTarget.path)) {
      outputTarget.path = normalizePath(path.join(config.rootDir, outputTarget.path));
    }

    if (!outputTarget.buildPath) {
      outputTarget.buildPath = DEFAULT_DIST_BUILD_DIR;
    }

    if (!path.isAbsolute(outputTarget.buildPath)) {
      outputTarget.buildPath = normalizePath(path.join(outputTarget.path, outputTarget.buildPath));
    }

    if (!outputTarget.collectionDir) {
      outputTarget.collectionDir = DEFAULT_COLLECTION_DIR;
    }

    if (!path.isAbsolute(outputTarget.collectionDir)) {
      outputTarget.collectionDir = normalizePath(path.join(outputTarget.path, outputTarget.collectionDir));
    }

    if (!outputTarget.typesDir) {
      outputTarget.typesDir = DEFAULT_TYPES_DIR;
    }

    if (!path.isAbsolute(outputTarget.typesDir)) {
      outputTarget.typesDir = normalizePath(path.join(outputTarget.path, outputTarget.typesDir));
    }

    if (typeof outputTarget.empty !== 'boolean') {
      outputTarget.empty = DEFAULT_DIST_EMPTY_DIR;
    }
  });
}

const DEFAULT_DIST_DIR = 'dist';
const DEFAULT_DIST_BUILD_DIR = '';
const DEFAULT_DIST_EMPTY_DIR = true;
const DEFAULT_COLLECTION_DIR = 'collection';
const DEFAULT_TYPES_DIR = 'types';
