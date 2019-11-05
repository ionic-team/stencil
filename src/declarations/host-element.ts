import { RenderNode } from './render';


export interface HostElement extends HTMLElement {
  // web component APIs
  connectedCallback?: () => void;
  attributeChangedCallback?: (attribName: string, oldVal: string, newVal: string, namespace: string) => void;
  disconnectedCallback?: () => void;
  host?: Element;
  forceUpdate?: () => void;

  // "s-" prefixed properties should not be property renamed
  // and should be common between all versions of stencil

  /**
   * Unique stencil id for this element
   */
  ['s-id']?: string;

  /**
   * Content Reference:
   * Reference to the HTML Comment that's placed inside of the
   * host element's original content. This comment is used to
   * always represent where host element's light dom is.
   */
  ['s-cr']?: RenderNode;

  /**
   * Lifecycle ready
   */
  ['s-lr']?: boolean;

  /**
   * On Render Callbacks:
   * Array of callbacks to fire off after it has rendered.
   */
  ['s-rc']?: (() => void)[];

  /**
   * Scope Id
   * The scope id of this component when using scoped css encapsulation
   * or using shadow dom but the browser doesn't support it
   */
  ['s-sc']?: string;

  /**
   * Hot Module Replacement, dev mode only
   */
  ['s-hmr']?: (versionId: string) => void;

  /**
   * Callback method for when HMR finishes
   */
  ['s-hmr-load']?: () => void;

  ['s-p']?: Promise<void>[];

  componentOnReady?: () => Promise<this>;
}

export interface CustomElementsDefineOptions {
  exclude?: string[];
  resourcesUrl?: string;
  syncQueue?: boolean;
  jmp?: (c: Function) => any;
  raf?: (c: FrameRequestCallback) => number;
  ael?: (el: EventTarget, eventName: string, listener: EventListenerOrEventListenerObject, options: boolean | AddEventListenerOptions) => void;
  rel?: (el: EventTarget, eventName: string, listener: EventListenerOrEventListenerObject, options: boolean | AddEventListenerOptions) => void;
}
