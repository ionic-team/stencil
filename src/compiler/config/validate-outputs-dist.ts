import * as d from '../../declarations';
import { DIST_COLLECTION, DIST_LAZY, isOutputTargetDist, DIST_LAZY_LOADER, getComponentsDtsTypesFilePath } from '../output-targets/output-utils';
import { normalizePath } from '@utils';
import { validateResourcesUrl } from './validate-resources-url';
import { validateCopy } from './validate-copy';


export function validateOutputTargetDist(config: d.Config) {
  const path = config.sys.path;

  const distOutputTargets = config.outputTargets.filter(isOutputTargetDist);

  distOutputTargets.forEach(outputTarget => {

    outputTarget.resourcesUrl = validateResourcesUrl(outputTarget.resourcesUrl);

    if (typeof outputTarget.dir !== 'string') {
      outputTarget.dir = DEFAULT_DIR;
    }

    if (!path.isAbsolute(outputTarget.dir)) {
      outputTarget.dir = normalizePath(path.join(config.rootDir, outputTarget.dir));
    }

    if (typeof outputTarget.buildDir !== 'string') {
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
      outputTarget.empty = true;
    }

    outputTarget.copy = validateCopy(outputTarget.copy, config.copy);

    config.outputTargets.push({
      type: DIST_COLLECTION,
      dir: outputTarget.dir,
      collectionDir: outputTarget.collectionDir,
      typesDir: outputTarget.typesDir,
      copy: outputTarget.copy
    });

    const namespace = config.fsNamespace || 'app';
    const lazyDir = path.join(outputTarget.buildDir, namespace);
    config.outputTargets.push({
      type: DIST_LAZY,
      copyDir: lazyDir,
      esmDir: lazyDir,
      systemDir: lazyDir,
      systemLoaderFile: path.join(lazyDir, namespace + '.js'),
      polyfills: true,
      isBrowserBuild: true,
    });

    if (config.buildDist) {
      const esmDir = path.join(outputTarget.dir, 'esm');
      const esmEs5Dir = path.join(outputTarget.dir, 'esm', 'legacy');
      const cjsDir = path.join(outputTarget.dir, 'cjs');

      // Create lazy output-target
      config.outputTargets.push({
        type: DIST_LAZY,
        esmDir,
        esmEs5Dir,
        cjsDir,

        cjsIndexFile: path.join(outputTarget.dir, 'index.js'),
        esmIndexFile: path.join(outputTarget.dir, 'index.mjs'),
        polyfills: true,
      });

      // Create output target that will generate the /loader entry-point
      config.outputTargets.push({
        type: DIST_LAZY_LOADER,
        dir: outputTarget.esmLoaderPath,

        esmDir,
        esmEs5Dir,
        cjsDir,
        componentDts: getComponentsDtsTypesFilePath(config, outputTarget),
        empty: outputTarget.empty
      });
    }
  });
}


const DEFAULT_DIR = 'dist';
const DEFAULT_BUILD_DIR = '';
const DEFAULT_COLLECTION_DIR = 'collection';
const DEFAULT_TYPES_DIR = 'types';
const DEFAULT_ESM_LOADER_DIR = 'loader';
