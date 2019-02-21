import * as d from '.';


export interface PrerenderInstructions {
  config: d.Config;
  compilerCtx: d.CompilerCtx;
  buildCtx: d.BuildCtx;
  outputTarget: d.OutputTargetWww;
  resolve: Function;
  templateId: string;
  pathsProcessing: Set<string>;
  pathsPending: Set<string>;
  pathsCompleted: Set<string>;
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
  collapseBooleanAttributes?: boolean;
  collapseWhitespace?: boolean;
  collectAnchors?: boolean;
  collectComponents?: boolean;
  collectImgs?: boolean;
  collectScripts?: boolean;
  collectStylesheets?: boolean;
  canonicalLink?: string;
  cookie?: string;
  direction?: string;
  headElements?: ElementData[];
  language?: string;
  minifyInlineStyles?: boolean;
  prettyHtml?: boolean;
  referrer?: string;
  removeHtmlComments?: boolean;
  removeUnusedStyles?: boolean;
  title?: string;
  url?: string;
  userAgent?: string;
}


export interface ElementData {
  tag: string;
  attributes?: {[key: string]: string}[];
}
