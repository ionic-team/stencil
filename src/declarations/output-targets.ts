import { Config, ServiceWorkerConfig } from './config';
import { CopyTask } from './assets';
import { Diagnostic } from './diagnostics';
import { CompilerCtx } from './compiler';
import { BuildCtx } from './build';
import { JsonDocs } from './docs';


export interface OutputTargetAngular extends OutputTargetBase {
  type: 'angular';

  componentCorePackage: string;
  directivesProxyFile?: string;
  directivesArrayFile?: string;
  directivesUtilsFile?: string;
  excludeComponents?: string[];
}

export interface OutputTargetCopy extends OutputTargetBase {
  type: 'copy';

  dir: string;
  copy?: CopyTask[];
  copyAssets?: 'collection' | 'dist';
}

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
  copy?: CopyTask[];

  /**
   * The base url of the app, it's required during prerendering to be the absolute path
   * of your app, such as: `https://my.app.com/app`.
   *
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

  serviceWorker?: ServiceWorkerConfig | null;
  appDir?: string;
}


export interface OutputTargetDist extends OutputTargetBase {
  type: 'dist';

  buildDir?: string;
  dir?: string;

  collectionDir?: string | null;
  typesDir?: string;
  esmLoaderPath?: string;
  copy?: CopyTask[];

  empty?: boolean;
}

export interface OutputTargetDistCollection extends OutputTargetBase {
  type: 'dist-collection';

  dir: string;
  collectionDir: string;
}

export interface OutputTargetDistTypes extends OutputTargetBase {
  type: 'dist-types';

  dir: string;
  typesDir: string;
}

export interface OutputTargetDistLazy extends OutputTargetBase {
  type: 'dist-lazy';

  esmDir?: string;
  esmEs5Dir?: string;
  systemDir?: string;
  cjsDir?: string;
  polyfills?: boolean;
  isBrowserBuild?: boolean;

  esmIndexFile?: string;
  cjsIndexFile?: string;
  systemLoaderFile?: string;
  legacyLoaderFile?: string;
}

export interface OutputTargetDistGlobalStyles extends OutputTargetBase {
  type: 'dist-global-styles';
  file: string;
}

export interface OutputTargetDistLazyLoader extends OutputTargetBase {
  type: 'dist-lazy-loader';
  dir: string;

  esmDir: string;
  esmEs5Dir: string;
  cjsDir: string;
  componentDts: string;

  empty: boolean;
}

export interface OutputTargetDistModule extends OutputTargetBase {
  type: 'experimental-dist-module';

  dir?: string;
  externalRuntime?: boolean;
  empty?: boolean;
  copy?: CopyTask[];
}


export interface OutputTargetDistSelfContained extends OutputTargetBase {
  type: 'dist-self-contained';

  dir?: string;
  buildDir?: string;

  empty?: boolean;
}


export interface OutputTargetHydrate extends OutputTargetBase {
  type: 'dist-hydrate-script';
  dir?: string;

  empty?: boolean;
}

export interface OutputTargetCustom extends OutputTargetBase {
  type: 'custom';
  name: string;
  validate?: (config: Config, diagnostics: Diagnostic[]) => void;
  generator: (config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, docs: JsonDocs) => Promise<void>;
}

export interface OutputTargetDocsVscode extends OutputTargetBase {
  type: 'docs-vscode';
  file: string;
  sourceCodeBaseUrl?: string;
}

export interface OutputTargetDocsReadme extends OutputTargetBase {
  type: 'docs-readme' | 'docs';

  dir?: string;
  footer?: string;
  strict?: boolean;
}


export interface OutputTargetDocsJson extends OutputTargetBase {
  type: 'docs-json';

  file: string;
  typesFile?: string | null;
  strict?: boolean;
}


export interface OutputTargetDocsCustom extends OutputTargetBase {
  type: 'docs-custom';

  generator: (docs: JsonDocs) => void | Promise<void>;
  strict?: boolean;
}


export interface OutputTargetStats extends OutputTargetBase {
  type: 'stats';

  file?: string;
}

export interface OutputTargetBase {
  type: string;
}

export type OutputTargetBuild =
 | OutputTargetDistCollection
 | OutputTargetDistLazy;


export type OutputTarget =
 | OutputTargetAngular
 | OutputTargetCopy
 | OutputTargetCustom
 | OutputTargetDist
 | OutputTargetDistCollection
 | OutputTargetDistLazy
 | OutputTargetDistGlobalStyles
 | OutputTargetDistLazyLoader
 | OutputTargetDistModule
 | OutputTargetDistSelfContained
 | OutputTargetDocsJson
 | OutputTargetDocsCustom
 | OutputTargetDocsReadme
 | OutputTargetDocsVscode
 | OutputTargetWww
 | OutputTargetHydrate
 | OutputTargetStats
 | OutputTargetDistTypes;
