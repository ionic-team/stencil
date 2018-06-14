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
  timestamp?: string;
}


export interface RendererApi {
  (
    hostElm: d.HostElement,
    oldVNode: d.VNode | Element,
    newVNode: d.VNode,
    useNativeShadowDom?: boolean,
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
  $?: Node[];
  [slotName: string]: Node[] | undefined;
}


/**
 * Generic node that represents all of the
 * different types of nodes we'd see when rendering
 */
export interface RenderNode extends d.HostElement {

  /**
   * Shadow root's host
   */
  host?: Element;

  /**
   * Is Content Reference Node:
   * This node is a content reference node.
   */
  ['s-cn']?: boolean;

  /**
   * Is a slot reference node:
   * This is a node that represents where a slots
   * was originally located.
   */
  ['s-sr']?: boolean;

  /**
   * Slot name
   */
  ['s-sn']?: string;

  /**
   * Host element tag name:
   * The tag name of the host element that this
   * node was created in.
   */
  ['s-hn']?: string;

  /**
   * Original Location Reference:
   * A reference pointing to the comment
   * which represents the original location
   * before it was moved to its slot.
   */
  ['s-ol']?: RenderNode;

  /**
   * Node reference:
   * This is a reference for a original location node
   * back to the node that's been moved around.
   */
  ['s-nr']?: RenderNode;

  /**
   * Scope Id
   */
  ['s-si']?: string;

  /**
   * Scope Id
   */
  ['s-si']?: string;
}
