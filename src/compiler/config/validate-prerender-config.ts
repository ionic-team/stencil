import { PrerenderConfig, RenderOptions, ValidatedConfig } from '../../declarations';
import { normalizePath } from '../util';


export function validatePrerenderConfig(config: ValidatedConfig) {
  if (config.prerender && config.generateWWW) {
    if (typeof config.prerender !== 'object' || Array.isArray(config.prerender)) {
      config.prerender = {};
    }

    config.prerender = Object.assign({}, DEFAULT_SSR_CONFIG, DEFAULT_PRERENDER_CONFIG, config.prerender);

    if (typeof config.prerender.hydrateComponents !== 'boolean') {
      config.prerender.hydrateComponents = true;
    }

    if (!config.prerender.prerenderDir) {
      config.prerender.prerenderDir = config.wwwDir;
    }

    if (!config.sys.path.isAbsolute(config.prerender.prerenderDir)) {
      config.prerender.prerenderDir = normalizePath(config.sys.path.join(config.rootDir, config.prerender.prerenderDir));
    }

    config.buildEs5 = true;

  } else if (config.prerender !== null && config.generateWWW && !config.devMode) {
    config.prerender = {
      hydrateComponents: false,
      crawl: false,
      include: [
        { path: '/' }
      ],
      collapseWhitespace: DEFAULT_SSR_CONFIG.collapseWhitespace,
      inlineLoaderScript:  DEFAULT_SSR_CONFIG.inlineLoaderScript,
      inlineStyles: false,
      inlineAssetsMaxSize: DEFAULT_SSR_CONFIG.inlineAssetsMaxSize,
      includePathQuery: DEFAULT_PRERENDER_CONFIG.includePathQuery,
      includePathHash: DEFAULT_PRERENDER_CONFIG.includePathHash,
      maxConcurrent: DEFAULT_PRERENDER_CONFIG.maxConcurrent,
      removeUnusedStyles: false
    };

    if (!config.prerender.prerenderDir) {
      config.prerender.prerenderDir = config.wwwDir;
    }

    if (!config.sys.path.isAbsolute(config.prerender.prerenderDir)) {
      config.prerender.prerenderDir = normalizePath(config.sys.path.join(config.rootDir, config.prerender.prerenderDir));
    }

  } else {
    config.prerender = null;
  }
}

export const DEFAULT_PRERENDER_CONFIG: PrerenderConfig = {
  crawl: true,
  include: [
    { path: '/' }
  ],
  includePathQuery: false,
  includePathHash: false,
  maxConcurrent: 4,
  hydrateComponents: true
};

export const DEFAULT_SSR_CONFIG: RenderOptions = {
  collapseWhitespace: true,
  inlineLoaderScript: true,
  inlineStyles: true,
  inlineAssetsMaxSize: 5000,
  removeUnusedStyles: true
};

export const DEFAULT_PRERENDER_HOST = 'prerender.stenciljs.com';
