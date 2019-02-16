import * as d from '.';


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


export interface HydrateOptions {
  collapseWhitespace?: boolean;
  collectAnchors?: boolean;
  collectComponents?: boolean;
  collectImgUrls?: boolean;
  collectScriptUrls?: boolean;
  collectStylesheetUrls?: boolean;
  canonicalLinkHref?: (url: string) => string;
  cookie?: string;
  direction?: string;
  language?: string;
  relocateMetaCharset?: boolean;
  referrer?: string;
  removeUnusedStyles?: boolean;
  req?: {
    protocol: string;
    get: (key: string) => string;
    originalUrl: string;
  };
  url?: string;
  userAgent?: string;
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
