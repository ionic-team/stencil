import * as d from '@declarations';
import { normalizePath } from '@utils';
import { sys } from '@sys';
import { isOutputTargetDist } from '../output-targets/output-utils';


export function validateOutputTargetDist(config: d.Config) {
  const path = sys.path;

  const distOutputTargets = config.outputTargets.filter(isOutputTargetDist);

  distOutputTargets.forEach(outputTarget => {

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

    if (!outputTarget.collectionDir) {
      outputTarget.collectionDir = DEFAULT_COLLECTION_DIR;
    }

    if (!path.isAbsolute(outputTarget.collectionDir)) {
      outputTarget.collectionDir = normalizePath(path.join(outputTarget.dir, outputTarget.collectionDir));
    }

    if (!outputTarget.esmLoaderPath) {
      outputTarget.esmLoaderPath = DEFAULT_ESM_LOADER_DIR;
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
  });
}


const DEFAULT_DIR = 'dist';
const DEFAULT_BUILD_DIR = '';
const DEFAULT_EMPTY_DIR = true;
const DEFAULT_COLLECTION_DIR = 'collection';
const DEFAULT_TYPES_DIR = 'types';
const DEFAULT_ESM_LOADER_DIR = 'loader';
