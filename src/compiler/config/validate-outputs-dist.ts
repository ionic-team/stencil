import * as d from '../../declarations';
import { normalizePath } from '@utils';
import { isOutputTargetDist } from '../output-targets/output-utils';
import { validateResourcesUrl } from './validate-resources-url';


export function validateOutputTargetDist(config: d.Config) {
  const path = config.sys.path;

  const distOutputTargets = config.outputTargets.filter(isOutputTargetDist);

  distOutputTargets.forEach(outputTarget => {

    outputTarget.resourcesUrl = validateResourcesUrl(outputTarget.resourcesUrl);

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

    if (!path.isAbsolute(outputTarget.esmLoaderPath)) {
      outputTarget.esmLoaderPath = normalizePath(path.resolve(outputTarget.dir, outputTarget.esmLoaderPath));
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

    config.outputTargets.push({
      type: 'dist-collection',
      dir: outputTarget.dir,
      collectionDir: outputTarget.collectionDir,
      empty: outputTarget.empty,
    });

    const lazyDir = path.join(outputTarget.buildDir, config.fsNamespace);
    config.outputTargets.push({
      type: 'dist-lazy',
      copyDir: lazyDir,
      esmDir: lazyDir,
      systemDir: lazyDir,
      systemLoaderFile: path.join(outputTarget.dir, config.fsNamespace + '.js'),
      esmLoaderFile: path.join(outputTarget.dir, config.fsNamespace + '.mjs.js'),
      polyfills: true,
    });

    if (config.buildEsm) {
      config.outputTargets.push({
        type: 'dist-lazy',
        esmDir: path.join(outputTarget.dir, 'esm'),
        esmEs5Dir: path.join(outputTarget.dir, 'esm', 'legacy'),
        cjsDir: path.join(outputTarget.dir, 'cjs'),

        cjsIndexFile: path.join(outputTarget.dir, 'index.js'),
        esmIndexFile: path.join(outputTarget.dir, 'index.mjs'),
        loaderDir: outputTarget.esmLoaderPath,
        webpackBuild: true,
        polyfills: true,
      });
    }
  });
}


const DEFAULT_DIR = 'dist';
const DEFAULT_BUILD_DIR = '';
const DEFAULT_EMPTY_DIR = true;
const DEFAULT_COLLECTION_DIR = 'collection';
const DEFAULT_TYPES_DIR = 'types';
const DEFAULT_ESM_LOADER_DIR = 'loader';
