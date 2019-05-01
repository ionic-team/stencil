import * as d from '.';


export interface PrerenderManager {
  basePath: string;
  compilerCtx: d.CompilerCtx;
  config: d.Config;
  devServerHostUrl: string;
  diagnostics: d.Diagnostic[];
  hydrateAppFilePath: string;
  isDebug: boolean;
  logCount: number;
  outputTarget: d.OutputTargetWww;
  prerenderConfig: d.HydrateConfig;
  prerenderConfigPath: string;
  resolve: Function;
  templateId: string;
  componentGraphPath: string;
  urlsProcessing: Set<string>;
  urlsPending: Set<string>;
  urlsCompleted: Set<string>;
}


export interface HydrateResults {
  diagnostics: d.Diagnostic[];
  url?: string;
  host?: string;
  hostname?: string;
  href?: string;
  port?: string;
  pathname?: string;
  search?: string;
  hash?: string;
  html?: string;
  components: HydrateComponent[];
  anchors: HydrateAnchorElement[];
  styles: HydrateStyleElement[];
  scripts: HydrateScriptElement[];
  imgs: HydrateImgElement[];
  title: string;
  hydratedCount: number;
}


export interface PrerenderRequest {
  componentGraphPath: string;
  devServerHostUrl: string;
  hydrateAppFilePath: string;
  prerenderConfigPath: string;
  templateId: string;
  url: string;
  writeToFilePath: string;
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
  approximateLineWidth?: number;
  beforeHydrate?(win: Window, opts: d.HydrateOptions): Promise<any>;
  canonicalLink?: string;
  constrainTimeouts?: boolean;
  clientHydrateAnnotations?: boolean;
  collapseBooleanAttributes?: boolean;
  cookie?: string;
  direction?: string;
  language?: string;
  maxHydrateCount?: number;
  minifyInlineStyles?: boolean;
  prettyHtml?: boolean;
  referrer?: string;
  removeAttributeQuotes?: boolean;
  removeEmptyAttributes?: boolean;
  removeScripts?: string[];
  removeUnusedStyles?: boolean;
  timeout?: number;
  title?: string;
  url?: string;
  userAgent?: string;
}


export interface HydrateConfig {
  afterHydrate?(doc?: Document, url?: URL): void | Promise<void>;
  approximateLineWidth?: number;
  beforeHydrate?(doc?: Document, url?: URL): void | Promise<void>;
  entryUrls?: string[];
  filterAnchor?(attrs: {[attrName: string]: string}, base?: URL): boolean;
  filterUrl?(url?: URL, base?: URL): boolean;
  filePath?(url?: URL, filePath?: string): string;
  hydrateOptions?(url?: URL): HydrateOptions;
  normalizeUrl?(href?: string, base?: URL): URL;
  trailingSlash?: boolean;
}
