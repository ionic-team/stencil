import * as d from '.';


export interface PrerenderManager {
  compilerCtx: d.CompilerCtx;
  config: d.Config;
  diagnostics: d.Diagnostic[];
  hydrateAppFilePath: string;
  isDebug: boolean;
  logCount: number;
  origin: string;
  outputTarget: d.OutputTargetWww;
  prerenderConfig: d.HydrateConfig;
  prerenderConfigPath: string;
  prodMode: boolean;
  resolve: Function;
  templateId: string;
  urlsProcessing: Set<string>;
  urlsPending: Set<string>;
  urlsCompleted: Set<string>;
}


export interface HydrateResults {
  diagnostics: d.Diagnostic[];
  url?: string;
  host?: string;
  hostname?: string;
  port?: string;
  pathname?: string;
  search?: string;
  hash?: string;
  html?: string;
  components?: HydrateComponent[];
  anchors?: HydrateAnchorElement[];
  styles?: HydrateStyleElement[];
  scripts?: HydrateScriptElement[];
  imgs?: HydrateImgElement[];
  title: string;
  hydratedCount: number;
}


export interface PrerenderRequest {
  hydrateAppFilePath: string;
  prerenderConfigPath: string;
  templateId: string;
  writeToFilePath: string;
  url: string;
}


export interface PrerenderResults {
  anchorUrls: string[];
  diagnostics: d.Diagnostic[];
  filePath: string;
}


export interface HydrateComponent {
  tag: string;
  count?: number;
  depth?: number;
}


export interface HydrateElement {
  [attrName: string]: string | undefined;
}


export interface HydrateAnchorElement extends HydrateElement {
  href?: string;
  target?: string;
}


export interface HydrateStyleElement extends HydrateElement {
  href?: string;
}


export interface HydrateScriptElement extends HydrateElement {
  src?: string;
  type?: string;
}


export interface HydrateImgElement extends HydrateElement {
  src?: string;
}


export interface HydrateOptions {
  afterHydrate?(win: Window, opts: d.HydrateOptions): Promise<any>;
  beforeHydrate?(win: Window, opts: d.HydrateOptions): Promise<any>;
  canonicalLink?: string;
  constrainTimeouts?: boolean;
  clientHydrateAnnotations?: boolean;
  collapseBooleanAttributes?: boolean;
  collapseWhitespace?: boolean;
  collectAnchors?: boolean;
  collectComponents?: boolean;
  collectImgs?: boolean;
  collectScripts?: boolean;
  collectStylesheets?: boolean;
  cookie?: string;
  direction?: string;
  language?: string;
  maxHydrateCount?: number;
  minifyInlineStyles?: boolean;
  prettyHtml?: boolean;
  referrer?: string;
  removeScripts?: string[];
  removeUnusedStyles?: boolean;
  title?: string;
  url?: string;
  userAgent?: string;
}


export interface HydrateConfig {
  entryUrls?: string[];

  filterUrl?(url?: URL, base?: URL): boolean;

  normalizeUrl?(url?: URL, base?: URL): string;

  filePath?(url?: URL): string;

  beforeHydrate?(doc?: Document, url?: URL): void | Promise<void>;

  afterHydrate?(doc?: Document, url?: URL): void | Promise<void>;

  hydrateOptions?(url?: URL): HydrateOptions;
}
