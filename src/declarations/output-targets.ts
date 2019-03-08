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

  /**
   * The default index html file of the app, commonly found at the
   * root of the `src` directory.
   * Default: `index.html`
   */
  indexHtml?: string;

  /**
   * The copy config is an array of objects that defines any files or folders that should
   * be copied over to the build directory.
   *
   * Each object in the array must include a src property which can be either an absolute path,
   * a relative path or a glob pattern. The config can also provide an optional dest property
   * which can be either an absolute path or a path relative to the build directory.
   * Also note that any files within src/assets are automatically copied to www/assets for convenience.
   *
   * In the copy config below, it will copy the entire directory from src/docs-content over to www/docs-content.
   */
  copy?: d.CopyTask[];

  /**
   * The base url of the app, which should be a relative path.
   * Default: `/`
   */
  baseUrl?: string;

  /**
   * By default, stencil will include all the polyfills required by legacy browsers in the ES5 build.
   * If it's `false`, stencil will not emit this polyfills anymore and it's your responsability to provide them before
   * stencil initializes.
   */
  polyfills?: boolean;

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

  serviceWorker?: d.ServiceWorkerConfig | null;
  resourcesUrl?: string;
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

export interface OutputTargetDistCollection extends OutputTargetBase {
  type: 'dist-collection';

  dir?: string;
  collectionDir?: string;
  typesDir?: string;
  empty?: boolean;
}



export interface OutputTargetDistLazy extends OutputTargetBase {
  type: 'dist-lazy';

  esmEs5Dir?: string;
  copyDir?: string;
  esmDir?: string;
  systemDir?: string;
  cjsDir?: string;
  resourcesUrl?: string;
  polyfills?: boolean;

  empty?: boolean;
}

export interface OutputTargetDistModule extends OutputTargetBase {
  type: 'dist-module';

  dir?: string;
}


export interface OutputTargetDistSelfcontained extends OutputTargetBase {
  type: 'dist-selfcontained';

  dir?: string;
  buildDir?: string;
  resourcesUrl?: string;
  empty?: boolean;
}


export interface OutputTargetHydrate extends OutputTargetBase {
  type: 'hydrate';
  dir?: string;
}

export interface OutputTargetDocsVscode extends OutputTargetBase {
  type: 'docs-vscode';
  file?: string;
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
  excludeComponents?: string[];
}


export interface OutputTargetBase {
  type: string;
}


export type OutputTargetBuild =
 | OutputTargetDistCollection
 | OutputTargetDistLazy;


export type OutputTarget =
 | OutputTargetDist
 | OutputTargetDistCollection
 | OutputTargetDistLazy
 | OutputTargetDistModule
 | OutputTargetDistSelfcontained
 | OutputTargetWww
 | OutputTargetHydrate
 | OutputTargetDocsJson
 | OutputTargetDocsCustom
 | OutputTargetDocsReadme
 | OutputTargetDocsVscode
 | OutputTargetAngular
 | OutputTargetStats;
