import * as d from '.';


export interface OutputTargetWww extends OutputTargetBase, d.HydrateOptions {
  /**
   * Webapp output target.
   */
  type: 'www';

  /**
   * The directory to write the app's JavaScript and CSS build
   * files to. The default is to place this directory as a child
   * to the `dir` config. Default: `build`
   */
  buildDir?: string;

  /**
   * The directory to write the entire application to.
   * Note, the `buildDir` is where the app's JavaScript and CSS build
   * files are written. Default: `www`
   */
  dir?: string;

  /**
   * Empty the build directory of all files and directories on first build.
   * Default: `true`
   */
  empty?: boolean;

  resourcesUrl?: string;

  /**
   * The default index html file of the app, commonly found at the
   * root of the `src` directory.
   * Default: `index.html`
   */
  indexHtml?: string;

  serviceWorker?: d.ServiceWorkerConfig | null;

  /**
   * The base url of the app, which should be a relative path.
   * Default: `/`
   */
  baseUrl?: string;

  /**
   * If prerendering should continue to crawl local links and prerender.
   * Default: `true`
   */
  prerenderUrlCrawl?: boolean;

  /**
   * The starting points for prerendering. This should be relative
   * paths. Default config is to starting at the index page: `/`.
   * Default: `[{ path: '/' }]`
   */
  prerenderLocations?: { path: string; }[];

  /**
   * This filter is called for every url found while crawling. Returning
   * `true` allows the URL to be crawled, and returning `false` will skip
   * the URL for prerendering. Default: `undefined`
   */
  prerenderFilter?: (url: URL) => boolean;

  /**
   * Format the HTML all pretty-like. Great for debugging, bad for build performance.
   */
  prettyHtml?: boolean;

  /**
   * Keep hashes in the URL while prerendering. Default: `false`
   */
  prerenderPathHash?: boolean;

  /**
   * Keep querystrings in the URL while prerendering. Default: `false`
   */
  prerenderPathQuery?: boolean;

  /**
   * Network requests to abort while prerendering. Default is to ignore
   * some common analytic and advertisement urls such `google-analytics.com`
   * and `doubleclick`.
   */
  prerenderAbortRequests?: {
    domain?: string;
  }[];
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


export interface OutputTargetWebComponent extends OutputTargetBase {
  type: 'webcomponent';

  dir?: string;
  buildDir?: string;
  resourcesUrl?: string;
  empty?: boolean;
}


export interface OutputTargetSelfContained extends OutputTargetBase {
  type: 'selfcontained';

  dir?: string;
  buildDir?: string;
  resourcesUrl?: string;
  empty?: boolean;
}


export interface OutputTargetDocsReadme extends OutputTargetBase {
  type: 'docs';

  dir?: string;
  strict?: boolean;
}


export interface OutputTargetDocsJson extends OutputTargetBase {
  type: 'docs-json';

  file: string;
  strict?: boolean;
}


export interface OutputTargetDocsCustom extends OutputTargetBase {
  type: 'docs-custom';

  generator: (docs: d.JsonDocs) => void | Promise<void>;
  strict?: boolean;
}


export interface OutputTargetStats extends OutputTargetBase {
  type: 'stats';

  file?: string;
}


export interface OutputTargetAngular extends OutputTargetBase {
  type: 'angular';

  componentCorePackage?: string;
  directivesProxyFile?: string;
  directivesArrayFile?: string;
  directivesUtilsFile?: string;
  serverModuleFile?: string;
  excludeComponents?: string[];
}


export interface OutputTargetBase {
  type: string;
}


export type OutputTargetBuild =
 | OutputTargetDist
 | OutputTargetWebComponent
 | OutputTargetWww;


export type OutputTarget =
 | OutputTargetAngular
 | OutputTargetStats
 | OutputTargetDocsJson
 | OutputTargetDocsCustom
 | OutputTargetDocsReadme
 | OutputTargetDist
 | OutputTargetWebComponent
 | OutputTargetSelfContained
 | OutputTargetWww;
