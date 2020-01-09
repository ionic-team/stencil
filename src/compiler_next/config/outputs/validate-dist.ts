import * as d from '../../../declarations';
import { getAbsolutePath } from '../utils';
import { COPY, DIST_COLLECTION, DIST_GLOBAL_STYLES, DIST_LAZY, DIST_LAZY_LOADER, DIST_TYPES, getComponentsDtsTypesFilePath, isOutputTargetDist } from '../../../compiler/output-targets/output-utils';
import { validateCopy } from '../../../compiler/config/validate-copy';
import { isAbsolute, join, resolve } from 'path';


export const validateDist = (config: d.Config, userOutputs: d.OutputTarget[]) => {
  const distOutputTargets = userOutputs.filter(isOutputTargetDist);
  return distOutputTargets.reduce((outputs, o) => {
    const outputTarget = validateOutputTargetDist(config, o);
    if (outputTarget.collectionDir) {
      outputs.push({
        type: DIST_COLLECTION,
        dir: outputTarget.dir,
        collectionDir: outputTarget.collectionDir,
      });
      outputs.push({
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

    outputs.push({
      type: DIST_TYPES,
      dir: outputTarget.dir,
      typesDir: outputTarget.typesDir
    });

    const namespace = config.fsNamespace || 'app';
    const lazyDir = join(outputTarget.buildDir, namespace);

    // Lazy build for CDN in dist
    outputs.push({
      type: DIST_LAZY,
      esmDir: lazyDir,
      systemDir: config.buildEs5 ? lazyDir : undefined,
      systemLoaderFile: config.buildEs5 ? join(lazyDir, namespace + '.js') : undefined,
      legacyLoaderFile: join(outputTarget.buildDir, namespace + '.js'),
      polyfills: outputTarget.polyfills !== undefined ? !!outputTarget.polyfills : true,
      isBrowserBuild: true,
    });
    outputs.push({
      type: COPY,
      dir: lazyDir,
      copyAssets: 'dist'
    });

    // Emit global styles
    outputs.push({
      type: DIST_GLOBAL_STYLES,
      file: join(lazyDir, `${config.fsNamespace}.css`),
    });

    if (config.buildDist) {
      const esmDir = join(outputTarget.dir, 'esm');
      const esmEs5Dir = config.buildEs5 ? join(outputTarget.dir, 'esm-es5') : undefined;
      const cjsDir = join(outputTarget.dir, 'cjs');

      // Create lazy output-target
      outputs.push({
        type: DIST_LAZY,
        esmDir,
        esmEs5Dir,
        cjsDir,

        cjsIndexFile: join(outputTarget.dir, 'index.js'),
        esmIndexFile: join(outputTarget.dir, 'index.mjs'),
        polyfills: true,
      });

      // Create output target that will generate the /loader entry-point
      outputs.push({
        type: DIST_LAZY_LOADER,
        dir: outputTarget.esmLoaderPath,

        esmDir,
        esmEs5Dir,
        cjsDir,
        componentDts: getComponentsDtsTypesFilePath(config, outputTarget),
        empty: outputTarget.empty
      });
    }
    return outputs;
  }, []);
};

const validateOutputTargetDist = (config: d.Config, o: d.OutputTargetDist) => {
  const outputTarget = {
    ...o,
    dir: getAbsolutePath(config, o.dir || DEFAULT_DIR)
  };

  if (typeof outputTarget.buildDir !== 'string') {
    outputTarget.buildDir = DEFAULT_BUILD_DIR;
  }

  if (!isAbsolute(outputTarget.buildDir)) {
    outputTarget.buildDir = join(outputTarget.dir, outputTarget.buildDir);
  }

  if (outputTarget.collectionDir === undefined) {
    outputTarget.collectionDir = DEFAULT_COLLECTION_DIR;
  }

  if (outputTarget.collectionDir && !isAbsolute(outputTarget.collectionDir)) {
    outputTarget.collectionDir = join(outputTarget.dir, outputTarget.collectionDir);
  }

  if (!outputTarget.esmLoaderPath) {
    outputTarget.esmLoaderPath = DEFAULT_ESM_LOADER_DIR;
  }

  if (!isAbsolute(outputTarget.esmLoaderPath)) {
    outputTarget.esmLoaderPath = resolve(outputTarget.dir, outputTarget.esmLoaderPath);
  }

  if (!outputTarget.typesDir) {
    outputTarget.typesDir = DEFAULT_TYPES_DIR;
  }

  if (!isAbsolute(outputTarget.typesDir)) {
    outputTarget.typesDir = join(outputTarget.dir, outputTarget.typesDir);
  }

  if (typeof outputTarget.empty !== 'boolean') {
    outputTarget.empty = true;
  }

  outputTarget.copy = validateCopy(outputTarget.copy, config.copy);
  return outputTarget;
};

const DEFAULT_DIR = 'dist';
const DEFAULT_BUILD_DIR = '';
const DEFAULT_COLLECTION_DIR = 'collection';
const DEFAULT_TYPES_DIR = 'types';
const DEFAULT_ESM_LOADER_DIR = 'loader';
