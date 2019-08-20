import * as d from '../../declarations';
import { setBooleanConfig, setStringConfig } from './config-utils';
import { validatePrerender } from './validate-prerender';
import { validateServiceWorker } from './validate-service-worker';
import { validateCopy } from './validate-copy';
import { COPY, DIST_GLOBAL_STYLES, DIST_LAZY, WWW, isOutputTargetDist, isOutputTargetWww } from '../output-targets/output-utils';
import { URL } from 'url';
import { buildError } from '@utils';

export function validateOutputTargetWww(config: d.Config, diagnostics: d.Diagnostic[]) {
  const hasOutputTargets = Array.isArray(config.outputTargets);
  const hasE2eTests = !!(config.flags && config.flags.e2e);

  if (!hasOutputTargets || (hasE2eTests && !config.outputTargets.some(isOutputTargetWww)) && !config.outputTargets.some(isOutputTargetDist)) {
    config.outputTargets = [
      { type: WWW }
    ];
  }

  const wwwOutputTargets = config.outputTargets.filter(isOutputTargetWww);

  if (config.flags.prerender && wwwOutputTargets.length === 0) {
    const err = buildError(diagnostics);
    err.messageText = `You need at least one "www" output target configured in your stencil.config.ts, when the "--prerender" flag is used`;
  }
  wwwOutputTargets.forEach(outputTarget => {
    validateOutputTarget(config, diagnostics, outputTarget);
  });
}


function validateOutputTarget(config: d.Config, diagnostics: d.Diagnostic[], outputTarget: d.OutputTargetWww) {
  const path = config.sys.path;

  setStringConfig(outputTarget, 'baseUrl', '/');
  setStringConfig(outputTarget, 'dir', DEFAULT_DIR);

  if (!path.isAbsolute(outputTarget.dir)) {
    outputTarget.dir = path.join(config.rootDir, outputTarget.dir);
  }

  // Make sure the baseUrl always finish with "/"
  if (!outputTarget.baseUrl.endsWith('/')) {
    outputTarget.baseUrl += '/';
  }

  // Fix "dir" to account
  outputTarget.appDir = path.join(outputTarget.dir, getPathName(outputTarget.baseUrl));

  setStringConfig(outputTarget, 'buildDir', DEFAULT_BUILD_DIR);

  if (!path.isAbsolute(outputTarget.buildDir)) {
    outputTarget.buildDir = path.join(outputTarget.appDir, outputTarget.buildDir);
  }

  setStringConfig(outputTarget, 'indexHtml', DEFAULT_INDEX_HTML);

  if (!path.isAbsolute(outputTarget.indexHtml)) {
    outputTarget.indexHtml = path.join(outputTarget.appDir, outputTarget.indexHtml);
  }

  setBooleanConfig(outputTarget, 'empty', null, DEFAULT_EMPTY_DIR);
  validatePrerender(config, diagnostics, outputTarget);
  validateServiceWorker(config, outputTarget);

  if (outputTarget.polyfills === undefined) {
    outputTarget.polyfills = true;
  }
  outputTarget.polyfills = !!outputTarget.polyfills;

  // Add dist-lazy output target
  const buildDir = outputTarget.buildDir;
  config.outputTargets.push({
    type: DIST_LAZY,
    esmDir: buildDir,
    systemDir: config.buildEs5 ? buildDir : undefined,
    systemLoaderFile: config.buildEs5 ? config.sys.path.join(buildDir, `${config.fsNamespace}.js`) : undefined,
    polyfills: outputTarget.polyfills,
    isBrowserBuild: true,
  });

  // Copy for dist
  config.outputTargets.push({
    type: COPY,
    dir: buildDir,
    copyAssets: 'dist'
  });

  // Copy for www
  config.outputTargets.push({
    type: COPY,
    dir: outputTarget.appDir,
    copy: validateCopy(outputTarget.copy, [
      ...(config.copy || []),
      ...DEFAULT_WWW_COPY,
    ]),
  });

  // Generate global style with original name
  config.outputTargets.push({
    type: DIST_GLOBAL_STYLES,
    file: config.sys.path.join(buildDir, `${config.fsNamespace}.css`),
  });
}

function getPathName(url: string) {
  const parsedUrl = new URL(url, 'http://localhost/');
  return parsedUrl.pathname;
}

const DEFAULT_WWW_COPY = [
  { src: 'assets', warn: false },
  { src: 'manifest.json', warn: false }
];
const DEFAULT_DIR = 'www';
const DEFAULT_INDEX_HTML = 'index.html';
const DEFAULT_BUILD_DIR = 'build';
const DEFAULT_EMPTY_DIR = true;
