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
  prerenderConfig: d.PrerenderConfig;
  prerenderConfigPath: string;
  resolve: Function;
  templateId: string;
  componentGraphPath: string;
  urlsProcessing: Set<string>;
  urlsPending: Set<string>;
  urlsCompleted: Set<string>;
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


export interface PrerenderConfig {
  afterHydrate?(document?: Document, url?: URL): any | Promise<any>;
  beforeHydrate?(document?: Document, url?: URL): any | Promise<any>;
  canonicalUrl?(url?: URL): string | null;
  entryUrls?: string[];
  filterAnchor?(attrs: {[attrName: string]: string}, base?: URL): boolean;
  filterUrl?(url?: URL, base?: URL): boolean;
  filePath?(url?: URL, filePath?: string): string;
  hydrateOptions?(url?: URL): d.HydrateDocumentOptions;
  normalizeUrl?(href?: string, base?: URL): URL;
  robotsTxt?(opts: RobotsTxtOpts): string | RobotsTxtResults;
  sitemapXml?(opts: SitemapXmpOpts): string | SitemapXmpResults;
  trailingSlash?: boolean;
}

export interface RobotsTxtOpts {
  urls: string[];
  sitemapUrl: string;
  baseUrl: string;
  dir: string;
}

export interface RobotsTxtResults {
  content: string;
  filePath: string;
  url: string;
}

export interface SitemapXmpOpts {
  urls: string[];
  baseUrl: string;
  dir: string;
}

export interface SitemapXmpResults {
  content: string;
  filePath: string;
  url: string;
}
