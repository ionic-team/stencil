import * as d from '../../declarations';
import { DIST_COLLECTION, DIST_GLOBAL_STYLES, DIST_LAZY, DIST_LAZY_LOADER, getComponentsDtsTypesFilePath, isOutputTargetDist, DIST_TYPES, COPY } from '../output-targets/output-utils';
import { validateCopy } from './validate-copy';


export function validateOutputTargetDist(config: d.Config) {
  const path = config.sys.path;

  const distOutputTargets = config.outputTargets.filter(isOutputTargetDist);

  distOutputTargets.forEach(outputTarget => {

    if (typeof outputTarget.dir !== 'string') {
      outputTarget.dir = DEFAULT_DIR;
    }

    if (!path.isAbsolute(outputTarget.dir)) {
      outputTarget.dir = path.join(config.rootDir, outputTarget.dir);
    }

    if (typeof outputTarget.buildDir !== 'string') {
      outputTarget.buildDir = DEFAULT_BUILD_DIR;
    }

    if (!path.isAbsolute(outputTarget.buildDir)) {
      outputTarget.buildDir = path.join(outputTarget.dir, outputTarget.buildDir);
    }

    if (outputTarget.collectionDir === undefined) {
      outputTarget.collectionDir = DEFAULT_COLLECTION_DIR;
    }

    if (outputTarget.collectionDir && !path.isAbsolute(outputTarget.collectionDir)) {
      outputTarget.collectionDir = path.join(outputTarget.dir, outputTarget.collectionDir);
    }

    if (!outputTarget.esmLoaderPath) {
      outputTarget.esmLoaderPath = DEFAULT_ESM_LOADER_DIR;
    }

    if (!path.isAbsolute(outputTarget.esmLoaderPath)) {
      outputTarget.esmLoaderPath = path.resolve(outputTarget.dir, outputTarget.esmLoaderPath);
    }

    if (!outputTarget.typesDir) {
      outputTarget.typesDir = DEFAULT_TYPES_DIR;
    }

    if (!path.isAbsolute(outputTarget.typesDir)) {
      outputTarget.typesDir = path.join(outputTarget.dir, outputTarget.typesDir);
    }

    if (typeof outputTarget.empty !== 'boolean') {
      outputTarget.empty = true;
    }

    outputTarget.copy = validateCopy(outputTarget.copy, config.copy);

    if (outputTarget.collectionDir) {
      config.outputTargets.push({
        type: DIST_COLLECTION,
        dir: outputTarget.dir,
        collectionDir: outputTarget.collectionDir,
      });
      config.outputTargets.push({
        type: COPY,
        dir: outputTarget.collectionDir,
        copyAssets: 'collection',
        copy: [
          ...outputTarget.copy,
          { src: '**/*.svg' },
          { src: '**/*.js' }
        ]
      });
    }

    config.outputTargets.push({
      type: DIST_TYPES,
      dir: outputTarget.dir,
      typesDir: outputTarget.typesDir
    });

    const namespace = config.fsNamespace || 'app';
    const lazyDir = path.join(outputTarget.buildDir, namespace);

    // Lazy build for CDN in dist
    config.outputTargets.push({
      type: DIST_LAZY,
      esmDir: lazyDir,
      systemDir: config.buildEs5 ? lazyDir : undefined,
      systemLoaderFile: config.buildEs5 ? path.join(lazyDir, namespace + '.js') : undefined,
      legacyLoaderFile: path.join(outputTarget.buildDir, namespace + '.js'),
      polyfills: true,
      isBrowserBuild: true,
    });
    config.outputTargets.push({
      type: COPY,
      dir: lazyDir,
      copyAssets: 'dist'
    });

    // Emit global styles
    config.outputTargets.push({
      type: DIST_GLOBAL_STYLES,
      file: config.sys.path.join(lazyDir, `${config.fsNamespace}.css`),
    });

    if (config.buildDist) {
      const esmDir = path.join(outputTarget.dir, 'esm');
      const esmEs5Dir = config.buildEs5 ? path.join(outputTarget.dir, 'esm-es5') : undefined;
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
