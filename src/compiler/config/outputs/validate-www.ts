import {
  buildError,
  COPY,
  DIST_GLOBAL_STYLES,
  DIST_LAZY,
  isBoolean,
  isOutputTargetDist,
  isOutputTargetWww,
  isString,
  normalizePath,
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

  return userWwwOutputs.reduce(
    (
      outputs: (d.OutputTargetWww | d.OutputTargetDistLazy | d.OutputTargetCopy | d.OutputTargetDistGlobalStyles)[],
      o
    ) => {
      const outputTarget = validateWwwOutputTarget(config, o, diagnostics);
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

      return outputs;
    },
    []
  );
};

const validateWwwOutputTarget = (
  config: d.ValidatedConfig,
  outputTarget: d.OutputTargetWww,
  diagnostics: d.Diagnostic[]
): d.ValidatedOutputTargetWww => {
  // Validate baseUrl
  let baseUrl = !isString(outputTarget.baseUrl) ? '/' : normalizePath(outputTarget.baseUrl);
  if (!baseUrl.endsWith('/')) {
    // Make sure the baseUrl always finish with "/"
    baseUrl += '/';
  }
  if (config.flags.ssr || config.flags.prerender || config.flags.task === 'prerender') {
    try {
      new URL(baseUrl);
    } catch (e) {
      const err = buildError(diagnostics);
      err.messageText = `invalid "baseUrl": ${e}`;
    }

    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      const err = buildError(diagnostics);
      err.messageText = `When prerendering, the "baseUrl" output target config must be a full URL and start with either "http://" or "https://". The config can be updated in the "www" output target within the stencil config.`;
    }
  }

  const dir = getAbsolutePath(config, outputTarget.dir || 'www');

  // Fix "dir" to account
  const pathname = new URL(baseUrl, 'http://localhost/').pathname;
  let appDir = join(dir, pathname);
  if (appDir.endsWith('/') || appDir.endsWith('\\')) {
    appDir = appDir.substring(0, appDir.length - 1);
  }

  // Validate buildDir
  let buildDir = !isString(outputTarget.buildDir) ? 'build' : outputTarget.buildDir;
  if (!isAbsolute(buildDir)) {
    buildDir = join(appDir, buildDir);
  }

  // Validate indexHtml
  let indexHtml = !isString(outputTarget.indexHtml) ? 'index.html' : outputTarget.indexHtml;
  if (!isAbsolute(indexHtml)) {
    indexHtml = join(appDir, indexHtml);
  }

  return {
    appDir,
    baseUrl,
    copy: outputTarget.copy,
    dir,
    buildDir,
    empty: isBoolean(outputTarget.empty) ? outputTarget.empty : true,
    indexHtml,
    polyfills: isBoolean(outputTarget.polyfills) ? outputTarget.polyfills : true,
    prerenderConfig: isString(outputTarget.prerenderConfig)
      ? !isAbsolute(outputTarget.prerenderConfig)
        ? join(config.rootDir, outputTarget.prerenderConfig)
        : outputTarget.prerenderConfig
      : null,
    serviceWorker: validateServiceWorker(config, { ...outputTarget, appDir }),
    type: outputTarget.type,
  };
};
