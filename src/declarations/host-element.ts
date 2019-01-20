import * as d from '.';


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
   * Host Element Id:
   * A unique id assigned to this host element.
   */
  ['s-id']?: string;

  /**
   * Content Reference:
   * Reference to the HTML Comment that's placed inside of the
   * host element's original content. This comment is used to
   * always represent where host element's light dom is.
   */
  ['s-cr']?: d.RenderNode;

  /**
   * Is Active Loading:
   * Set of child host elements that are actively loading.
   */
  ['s-al']?: Set<HostElement>;

  /**
   * Has Rendered:
   * Set to true if this component has rendered
   */
  ['s-rn']?: boolean;

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
   * Component Initial Load:
   * The component has fully loaded, instance creatd,
   * and has rendered. Method is on the host element prototype.
   */
  ['s-init']?: () => void;

  /**
   * Hot Module Replacement, dev mode only
   */
  ['s-hmr']?: (versionId: string) => void;

  /**
   * Callback method for when HMR finishes
   */
  ['s-hmr-load']?: () => void;

  componentOnReady?: () => Promise<this>;
  color?: string;
  mode?: string;
}
