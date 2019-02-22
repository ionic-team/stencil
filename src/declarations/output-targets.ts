import * as d from '.';


export interface OutputTargetWww extends OutputTargetBase {
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
   * Path to an external node module which has exports of the prerender config object.
   * ```
   * module.exports = {
   *   afterHydrate(document, url) {
   *     document.title = `URL: ${url.href}`;
   *   }
   * }
   * ```
   */
  prerenderConfig?: string;
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


export interface OutputTargetHydrate extends OutputTargetBase {
  type: 'hydrate';
  dir?: string;
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
 | OutputTargetHydrate
 | OutputTargetSelfContained
 | OutputTargetWebComponent
 | OutputTargetWww;
