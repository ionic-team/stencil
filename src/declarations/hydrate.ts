

export interface RenderToStringOptions extends HydrateDocumentOptions {
  afterHydrate?(document: any): any | Promise<any>;
  approximateLineWidth?: number;
  beforeHydrate?(document: any): any | Promise<any>;
  prettyHtml?: boolean;
  removeBooleanAttributeQuotes?: boolean;
  removeEmptyAttributes?: boolean;
}

export interface HydrateDocumentOptions {
  canonicalUrl?: string;
  constrainTimeouts?: boolean;
  clientHydrateAnnotations?: boolean;
  cookie?: string;
  direction?: string;
  language?: string;
  maxHydrateCount?: number;
  referrer?: string;
  removeScripts?: boolean;
  removeUnusedStyles?: boolean;
  timeout?: number;
  title?: string;
  url?: string;
  userAgent?: string;
}

export interface HydrateResults {
  diagnostics: HydrateDiagnostic[];
  url: string;
  host: string;
  hostname: string;
  href: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  html: string;
  components: HydrateComponent[];
  anchors: HydrateAnchorElement[];
  styles: HydrateStyleElement[];
  scripts: HydrateScriptElement[];
  imgs: HydrateImgElement[];
  title: string;
  hydratedCount: number;
}

export interface HydrateComponent {
  tag: string;
  count: number;
  depth: number;
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

export interface HydrateDiagnostic {
  level: string | any;
  type: string | any;
  header?: string;
  language?: string;
  messageText: string;
  debugText?: string;
  code?: string;
  absFilePath?: string;
  relFilePath?: string;
  lineNumber?: number;
  columnNumber?: number;
  lines?: {
    lineIndex: number;
    lineNumber: number;
    text?: string;
    errorCharStart: number;
    errorLength?: number;
  }[];
}
