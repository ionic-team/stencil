import * as d from '@declarations';
import { setBooleanConfig, setStringConfig } from './config-utils';
import { sys } from '@sys';
import { validatePrerender } from './validate-prerender';
import { isOutputTargetWww } from '../output-targets/output-utils';
import { validateResourcesUrl } from './validate-resources-url';
import { validateServiceWorker } from './validate-service-worker';
import { validateCopy } from './validate-copy';


export function validateOutputTargetWww(config: d.Config) {
  if (!Array.isArray(config.outputTargets)) {
    config.outputTargets = [
      { type: 'www' }
    ];
  }

  const wwwOutputTargets = config.outputTargets.filter(isOutputTargetWww);
  wwwOutputTargets.forEach(outputTarget => {
    validateOutputTarget(config, outputTarget);
  });
}


function validateOutputTarget(config: d.Config, outputTarget: d.OutputTargetWww) {
  const path = sys.path;

  setStringConfig(outputTarget, 'dir', DEFAULT_DIR);

  if (!path.isAbsolute(outputTarget.dir)) {
    outputTarget.dir = sys.path.join(config.rootDir, outputTarget.dir);
  }

  setStringConfig(outputTarget, 'buildDir', DEFAULT_BUILD_DIR);

  if (!path.isAbsolute(outputTarget.buildDir)) {
    outputTarget.buildDir = sys.path.join(outputTarget.dir, outputTarget.buildDir);
  }

  setStringConfig(outputTarget, 'indexHtml', DEFAULT_INDEX_HTML);

  if (!path.isAbsolute(outputTarget.indexHtml)) {
    outputTarget.indexHtml = sys.path.join(outputTarget.dir, outputTarget.indexHtml);
  }

  setBooleanConfig(outputTarget, 'empty', null, DEFAULT_EMPTY_DIR);
  validatePrerender(config, outputTarget);

  outputTarget.copy = validateCopy(outputTarget.copy, [
    ...config.copy,
    ...DEFAULT_WWW_COPY,
  ]);
  outputTarget.resourcesUrl = validateResourcesUrl(outputTarget.resourcesUrl);
  outputTarget.serviceWorker = validateServiceWorker(config, outputTarget.serviceWorker, outputTarget.dir);
  outputTarget.polyfills = !!outputTarget.polyfills;

  // Add dist-lazy output target
  config.outputTargets.push({
    type: 'dist-lazy',
    copyDir: outputTarget.buildDir,
    esmDir: outputTarget.buildDir,
    systemDir: outputTarget.buildDir,
    polyfills: outputTarget.polyfills
  });
}


const DEFAULT_WWW_COPY = [
  { src: 'assets', warn: false },
  { src: 'manifest.json', warn: false }
];
const DEFAULT_DIR = 'www';
const DEFAULT_INDEX_HTML = 'index.html';
const DEFAULT_BUILD_DIR = 'build';
const DEFAULT_EMPTY_DIR = true;
