import { BuildConfig, PrerenderConfig, RenderOptions } from '../../util/interfaces';
import { normalizePath } from '../util';


export function validatePrerenderConfig(config: BuildConfig) {
  if (config.prerender && config.generateWWW) {
    if (typeof config.prerender !== 'object' || Array.isArray(config.prerender)) {
      config.prerender = {};
    }

    config.prerender = Object.assign({}, DEFAULT_SSR_CONFIG, DEFAULT_PRERENDER_CONFIG, config.prerender);

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
    { url: '/' }
  ],
  maxConcurrent: 4,
  host: 'dev.prerender.stenciljs.com'
};


export const DEFAULT_SSR_CONFIG: RenderOptions = {
  collapseWhitespace: true,
  inlineLoaderScript: true,
  inlineStyles: true,
  inlineAssetsMaxSize: 5000,
  removeUnusedStyles: true,
};
