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
  collectImgUrls?: boolean;
  collectScriptUrls?: boolean;
  collectStylesheetUrls?: boolean;
  canonicalLinkHref?: string;
  cookie?: string;
  direction?: string;
  headElements?: ElementData[];
  language?: string;
  minifyInlineStyles?: boolean;
  pretty?: boolean;
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
