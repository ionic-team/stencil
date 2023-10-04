import {
  buildError,
  COPY,
  DIST_GLOBAL_STYLES,
  DIST_LAZY,
  isBoolean,
  isOutputTargetDist,
  isOutputTargetWww,
  isString,
  WWW,
} from '@utils';
import { isAbsolute, join } from 'path';

import type * as d from '../../../declarations';
import { getAbsolutePath } from '../config-utils';
import { validateCopy } from '../validate-copy';
import { validateServiceWorker } from '../validate-service-worker';

export const validateWww = (config: d.ValidatedConfig, diagnostics: d.Diagnostic[], userOutputs: d.OutputTarget[]) => {
  const hasOutputTargets = userOutputs.length > 0;
  const hasE2eTests = !!config.flags.e2e;
  const userWwwOutputs = userOutputs.filter(isOutputTargetWww);

  if (
    !hasOutputTargets ||
    (hasE2eTests && !userOutputs.some(isOutputTargetWww) && !userOutputs.some(isOutputTargetDist))
  ) {
    userWwwOutputs.push({ type: WWW });
  }

  if (config.flags.prerender && userWwwOutputs.length === 0) {
    const err = buildError(diagnostics);
    err.messageText = `You need at least one "www" output target configured in your stencil.config.ts, when the "--prerender" flag is used`;
  }

  const outputs: (
    | d.ValidatedOutputTargetWww
    | d.OutputTargetDistLazy
    | d.OutputTargetCopy
    | d.OutputTargetDistGlobalStyles
  )[] = [];

  for (const userOutputTarget of userWwwOutputs) {
    const outputTarget = validateWwwOutputTarget(config, userOutputTarget, diagnostics);
    outputs.push(outputTarget);

    // Add dist-lazy output target
    const buildDir = outputTarget.buildDir;
    outputs.push({
      type: DIST_LAZY,
      dir: buildDir,
      esmDir: buildDir,
      systemDir: config.buildEs5 ? buildDir : undefined,
      systemLoaderFile: config.buildEs5 ? join(buildDir, `${config.fsNamespace}.js`) : undefined,
      polyfills: outputTarget.polyfills,
      isBrowserBuild: true,
    });

    // Copy for dist
    outputs.push({
      type: COPY,
      dir: buildDir,
      copyAssets: 'dist',
    });

    // Copy for www
    outputs.push({
      type: COPY,
      dir: outputTarget.appDir,
      copy: validateCopy(outputTarget.copy, [
        { src: 'assets', warn: false },
        { src: 'manifest.json', warn: false },
      ]),
    });

    // Generate global style with original name
    outputs.push({
      type: DIST_GLOBAL_STYLES,
      file: join(buildDir, `${config.fsNamespace}.css`),
    });
  }

  return outputs;
};

const validateWwwOutputTarget = (
  config: d.ValidatedConfig,
  outputTarget: d.OutputTargetWww,
  diagnostics: d.Diagnostic[],
): d.ValidatedOutputTargetWww => {
  const baseUrl = validateBaseUrl(outputTarget.baseUrl);
  const dir = getAbsolutePath(config, outputTarget.dir || 'www');
  const appDir = validateAppDir(baseUrl, dir);

  const validatedOutputTarget = {
    appDir,
    baseUrl,
    buildDir: validateBuildDir(outputTarget.buildDir, appDir),
    copy: outputTarget.copy ?? null,
    dir,
    empty: isBoolean(outputTarget.empty) ? outputTarget.empty : true,
    indexHtml: validateIndexHtml(outputTarget.indexHtml, appDir),
    polyfills: isBoolean(outputTarget.polyfills) ? outputTarget.polyfills : true,
    prerenderConfig: validatePrerenderConfig(outputTarget.prerenderConfig, baseUrl, config, diagnostics),
    serviceWorker: validateServiceWorker(config, outputTarget.serviceWorker, appDir),
    type: 'www',
  } satisfies d.ValidatedOutputTargetWww;

  return validatedOutputTarget;
};

const validateAppDir = (baseUrl: string, dir: string): string => {
  const pathname = new URL(baseUrl, 'http://localhost/').pathname;
  let appDir = join(dir, pathname);
  if (appDir.endsWith('/') || appDir.endsWith('\\')) {
    appDir = appDir.substring(0, appDir.length - 1);
  }

  return appDir;
};

const validateBaseUrl = (baseUrl: string | undefined): string => {
  if (!isString(baseUrl)) {
    baseUrl = '/';
  }
  if (!baseUrl.endsWith('/')) {
    // Make sure the baseUrl always finish with "/"
    baseUrl += '/';
  }

  return baseUrl;
};

const validateBuildDir = (buildDir: string | undefined, appDir: string): string => {
  buildDir = isString(buildDir) ? buildDir : 'build';
  if (!isAbsolute(buildDir)) {
    buildDir = join(appDir, buildDir);
  }

  return buildDir;
};

const validateIndexHtml = (indexHtml: string | undefined, appDir: string): string => {
  if (!isString(indexHtml)) {
    indexHtml = 'index.html';
  }
  if (!isAbsolute(indexHtml)) {
    indexHtml = join(appDir, indexHtml);
  }

  return indexHtml;
};

const validatePrerenderConfig = (
  prerenderConfig: string | null | undefined,
  baseUrl: string,
  config: d.ValidatedConfig,
  diagnostics: d.Diagnostic[],
): string | null => {
  if (!config.flags.ssr && !config.flags.prerender && config.flags.task !== 'prerender') {
    return null;
  }

  if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
    const err = buildError(diagnostics);
    err.messageText = `When prerendering, the "baseUrl" output target config must be a full URL and start with either "http://" or "https://". The config can be updated in the "www" output target within the stencil config.`;
  }

  try {
    new URL(baseUrl);
  } catch (e) {
    const err = buildError(diagnostics);
    err.messageText = `invalid "baseUrl": ${e}`;
  }

  if (isString(prerenderConfig)) {
    if (!isAbsolute(prerenderConfig)) {
      prerenderConfig = join(config.rootDir, prerenderConfig);
    }
  }

  return prerenderConfig ?? null;
};
