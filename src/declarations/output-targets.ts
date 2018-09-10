import * as d from '.';


export interface OutputTargetWww extends OutputTargetBase {
  type: 'www';

  buildDir?: string;
  dir?: string;
  empty?: boolean;
  resourcesUrl?: string;

  indexHtml?: string;
  serviceWorker?: d.ServiceWorkerConfig | null;
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


export interface OutputTargetDist extends OutputTargetBase {
  type: 'dist';

  buildDir?: string;
  dir?: string;
  empty?: boolean;
  resourcesUrl?: string;

  collectionDir?: string;
  typesDir?: string;
  esmLoaderPath?: string;
}


export interface OutputTargetDocs extends OutputTargetBase {
  type: 'docs';

  readmeDir?: string;
  jsonFile?: string;
}


export interface OutputTargetStats extends OutputTargetBase {
  type: 'stats';

  file?: string;
}


export interface OutputTargetAngular extends OutputTargetBase {
  type: 'angular';

  buildDir?: string;
  dir?: string;
  empty?: boolean;
  resourcesUrl?: string;

  typesDir?: string;
  componentCorePackage?: string;
  directivesProxyFile?: string;
  directivesArrayFile?: string;
  excludeComponents?: string[];
}


export interface OutputTargetBase {
  type: string;
  appBuild?: boolean;
}


export type OutputTargetBuild =
 | OutputTargetAngular
 | OutputTargetDist
 | OutputTargetHydrate
 | OutputTargetWww;


export type OutputTarget =
 | OutputTargetAngular
 | OutputTargetStats
 | OutputTargetDocs
 | OutputTargetHydrate
 | OutputTargetDist
 | OutputTargetWww;
