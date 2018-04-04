import * as d from './index';


export interface RenderOptions {
  canonicalLink?: boolean;
  collapseWhitespace?: boolean;
  inlineAssetsMaxSize?: number;
  inlineLoaderScript?: boolean;
  inlineStyles?: boolean;
  removeUnusedStyles?: boolean;
  ssrIds?: boolean;
  userAgent?: string;
  cookie?: string;
  direction?: string;
  language?: string;
}


export interface PrerenderLocation {
  url?: string;
  path?: string;
  status?: 'pending' | 'processing' | 'complete';
}


export interface HydrateResults {
  diagnostics: d.Diagnostic[];
  url?: string;
  host?: string;
  hostname?: string;
  port?: string;
  path?: string;
  pathname?: string;
  search?: string;
  query?: string;
  hash?: string;
  html?: string;
  styles?: string;
  anchors?: HydrateAnchor[];
  root?: HTMLElement;
  components?: HydrateComponent[];
  styleUrls?: string[];
  scriptUrls?: string[];
  imgUrls?: string[];
}


export interface HydrateComponent {
  tag: string;
  count?: number;
  depth?: number;
}


export interface HydrateAnchor {
  href?: string;
  target?: string;
  [attrName: string]: string | undefined;
}


export interface HydrateOptions extends RenderOptions {
  req?: {
    protocol: string;
    get: (key: string) => string;
    originalUrl: string;
  };
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
  console?: {
    [level: string]: (...msgs: string[]) => void;
  };
  hydrateComponents?: boolean;
}


export interface RendererApi {
  (
    oldVNode: d.VNode | Element,
    newVNode: d.VNode,
    isUpdate?: boolean,
    encapsulation?: d.Encapsulation,
    ssrId?: number
  ): d.VNode;
}


export interface HostSnapshot {
  $id?: string;
  $attributes?: HostSnapshotAttributes;
}


export interface HostSnapshotAttributes {
  [attrName: string]: string;
}


export interface ContentSlots {
  $defaultSlot?: Node[];
  [slotName: string]: Node[];
}
