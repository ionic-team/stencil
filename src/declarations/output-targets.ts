import * as d from './index';


export interface OutputTargetWww extends OutputTarget {
  buildDir?: string;
  dir?: string;
  empty?: boolean;
  indexHtml?: string;
  resourcesUrl?: string;
  serviceWorker?: d.ServiceWorkerConfig;

  baseUrl?: string;
  canonicalLink?: boolean;
  collapseWhitespace?: boolean;
  hydrateComponents?: boolean;
  inlineStyles?: boolean;
  inlineLoaderScript?: boolean;
  inlineAssetsMaxSize?: number;
  prerenderUrlCrawl?: boolean;
  prerenderLocations?: d.PrerenderLocation[];
  prerenderFilter?: (url: d.Url) => boolean;
  prerenderPathHash?: boolean;
  prerenderPathQuery?: boolean;
  prerenderMaxConcurrent?: number;
  removeUnusedStyles?: boolean;
}


export interface OutputTargetDist extends OutputTarget {
  buildDir?: string;
  collectionDir?: string;
  dir?: string;
  empty?: boolean;
  resourcesUrl?: string;
  typesDir?: string;
}


export interface OutputTargetHydrate extends OutputTargetWww, d.HydrateOptions {
  html?: string;
  url?: string;
  path?: string;
  referrer?: string;
  userAgent?: string;
  cookie?: string;
  direction?: string;
  language?: string;
  isPrerender?: boolean;
  serializeHtml?: boolean;
  destroyDom?: boolean;
}


export interface OutputTargetDocs extends OutputTarget {
  readmeDir?: string;
  jsonFile?: string;
}


export interface OutputTargetStats extends OutputTarget {
  file?: string;
}


export interface OutputTargetAngular extends OutputTarget {
  buildDir?: string;
  dir?: string;
  empty?: boolean;
  resourcesUrl?: string;
  typesDir?: string;
  directivesProxyFile?: string;
  directivesArrayFile?: string;
  excludeComponents?: string[];
}

export interface OutputTargetCustomElements extends OutputTarget {

}


export interface OutputTarget {
  type?: 'angular' | 'dist' | 'docs' | 'stats' | 'www';
  appBuild?: boolean;
}
