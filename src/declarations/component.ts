import * as d from '.';


export interface ComponentWillLoad {
  /**
   * componentWillLoad
   */
  componentWillLoad: () => Promise<void> | void;
}

export interface ComponentDidLoad {
  /**
   * componentDidLoad
   */
  componentDidLoad: () => void;
}

export interface ComponentWillUpdate {
  /**
   * componentWillUpdate
   */
  componentWillUpdate: () => Promise<void> | void;
}

export interface ComponentDidUpdate {
  /**
   * componentDidUpdate
   */
  componentDidUpdate: () => void;
}

export interface ComponentDidUnload {
  /**
   * componentDidUnload
   */
  componentDidUnload: () => void;
}


export interface ComponentConstructor {
  is?: string;
  properties?: ComponentConstructorProperties;
  events?: ComponentConstructorEvent[];
  listeners?: ComponentConstructorListener[];
  host?: ComponentConstructorHost;
  style?: string;
  styleMode?: string;
  encapsulation?: Encapsulation;
}


export interface ComponentConstructorHost {
  theme?: string;
  [attrName: string]: string | undefined;
}


export interface ComponentMeta {
  // "Meta" suffix to ensure property renaming
  tagNameMeta?: string;
  bundleIds?: string | BundleIds | GetModuleFn;
  stylesMeta?: d.StylesMeta;
  membersMeta?: MembersMeta;
  eventsMeta?: EventMeta[];
  listenersMeta?: ListenMeta[];
  hostMeta?: HostMeta;
  encapsulationMeta?: number;
  assetsDirsMeta?: AssetsMeta[];
  componentConstructor?: ComponentConstructor;
  componentClass?: string;
  dependencies?: ComponentDependencies;
  jsdoc?: JsDoc;
  styleDocs?: StyleDoc[];
  hmrLoad?: () => void;
}


export type GetModuleFn = (opts?: GetModuleOptions) => Promise<ComponentConstructor>;


export interface GetModuleOptions {
  scoped?: boolean;
  mode?: string;
}


export interface BundleIds {
  [modeName: string]: string;
}


export interface MembersMeta {
  [memberName: string]: MemberMeta;
}


export interface MemberMeta {
  memberType?: number;
  propType?: number;
  attribName?: string;
  attribType?: AttributeTypeInfo;
  reflectToAttrib?: boolean;
  ctrlId?: string;
  jsdoc?: JsDoc;
  watchCallbacks?: string[];
}


export interface AttributeTypeReference {
  referenceLocation: 'local' | 'global' | 'import';
  importReferenceLocation?: string;
}

export interface AttributeTypeReferences {
  [key: string]: AttributeTypeReference;
}

export interface AttributeTypeInfo {
  text: string;
  typeReferences?: AttributeTypeReferences;
}


export interface AssetsMeta {
  absolutePath?: string;
  cmpRelativePath?: string;
  originalComponentPath?: string;
  originalCollectionPath?: string;
}


export interface HostMeta {
  [key: string]: any;
}


export type Encapsulation = 'shadow' | 'scoped' | 'none';


export interface ComponentConstructorProperties {
  [propName: string]: ComponentConstructorProperty;
}


export interface ComponentConstructorProperty {
  attr?: string;
  connect?: string;
  context?: string;
  elementRef?: boolean;
  method?: boolean;
  mutable?: boolean;
  reflectToAttr?: boolean;
  state?: boolean;
  type?: PropertyType;
  watchCallbacks?: string[];
}

export type PropertyType = StringConstructor | BooleanConstructor | NumberConstructor | 'Any';


export interface ComponentConstructorEvent {
  name: string;
  method: string;
  bubbles: boolean;
  cancelable: boolean;
  composed: boolean;
}


export interface ComponentConstructorListener {
  name: string;
  method: string;
  capture?: boolean;
  disabled?: boolean;
  passive?: boolean;
}


export interface EventMeta {
  eventName: string;
  eventMethodName?: string;
  eventBubbles?: boolean;
  eventCancelable?: boolean;
  eventComposed?: boolean;
  eventType?: AttributeTypeInfo;
  jsdoc?: JsDoc;
}


export interface ListenMeta {
  eventMethodName?: string;
  eventName?: string;
  eventCapture?: boolean;
  eventPassive?: boolean;
  eventDisabled?: boolean;
  jsdoc?: JsDoc;
}


export interface JsDoc {
  name: string;
  documentation: string;
  type: string;
}


export interface StyleDoc {
  name: string;
  docs: string;
  annotation: 'prop';
}


export type ComponentDependencies = string[];


export interface ComponentInstance {
  /**
   * The component is about to load and it has not
   * rendered yet.
   *
   * This is the best place to make any data updates
   * before the first render.
   *
   * componentWillLoad will only be called once.
   */
  componentWillLoad?: () => Promise<void> | void;

  /**
   * The component has loaded and has already rendered.
   *
   * Updating data in this method will cause the
   * component to re-render.
   *
   * componentDidLoad will only be called once.
   */
  componentDidLoad?: () => void;

  /**
   * The component is about to update and re-render.
   *
   * Called multiple times throughout the life of
   * the component as it updates.
   *
   * componentWillUpdate is not called on the first render.
   */
  componentWillUpdate?: () => Promise<void> | void;

  /**
   * The component has just re-rendered.
   *
   * Called multiple times throughout the life of
   * the component as it updates.
   *
   * componentWillUpdate is not called on the
   * first render.
   */
  componentDidUpdate?: () => void;

  /**
   * The component did unload and the element
   * will be destroyed.
   */
  componentDidUnload?: () => void;

  render?: () => any;
  /**
   * Used to dynamically set host element attributes.
   * Should be placed directly above render()
   */
  hostData?: () => d.VNodeData;

  mode?: string;
  color?: string;

  [memberName: string]: any;
}


export abstract class ComponentModule {
  abstract componentWillLoad?: () => Promise<void> | void;
  abstract componentDidLoad?: () => void;
  abstract componentWillUpdate?: () => Promise<void> | void;
  abstract componentDidUpdate?: () => void;
  abstract componentDidUnload?: () => void;

  abstract render?: () => any;
  abstract hostData?: () => d.VNodeData;

  abstract mode?: string;
  abstract color?: string;

  abstract __el?: HostElement;

  [memberName: string]: any;

  abstract get is(): string;
  abstract get properties(): string;
}


export interface ComponentInternalValues {
  [propName: string]: any;
}


export interface ComponentModule {
  new(): ComponentInstance;
}


export interface ComponentRegistry {
  // registry tag must always be lower-case
  [tagName: string]: ComponentMeta;
}


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
   * SSR Id:
   * Numeric id assigned to the element during ssr.
   */
  ['s-ssr-id']?: number;

  /**
   * Content Reference:
   * Reference to the HTML Comment that's placed inside of the
   * host element's original content. This node is used to
   * always represent where host element's light dom is.
   */
  ['s-cr']?: d.RenderNode;

  /**
   * Is Active Loading:
   * Array of child host elements that are actively loading.
   * (deprecated $activeLoading)
   */
  ['s-ld']?: HostElement[];

  /**
   * Has Rendered:
   * Set to true if this component has rendered
   * (deprecated $rendered)
   */
  ['s-rn']?: boolean;

  /**
   * On Render Callbacks:
   * Array of callbacks to fire off after it has rendered.
   * (deprecated $onRender)
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
   * (deprecated $initLoad)
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

export interface ComponentAppliedStyles {
  [tagNameForStyles: string]: boolean;
}


export type OnReadyCallback = ((elm: d.HostElement) => void);


export interface ComponentHostData {
  /**
   * tag name (ion-badge)
   */
  [0]: string;

  /**
   * map of bundle ids
   */
  [1]: {
    [modeName: string]: any[];
  };

  /**
   * has styles
   */
  [2]: boolean;

  /**
   * members
   */
  [3]: ComponentMemberData[];

  /**
   * encapsulated
   */
  [4]: number;

  /**
   * listeners
   */
  [5]: ComponentListenersData[];
}


export interface ComponentMemberData {
  /**
   * member name
   */
  [0]: string;

  /**
   * member type
   */
  [1]: number;

  /**
   * reflect to attribute
   */
  [2]: boolean;

  /**
   * is attribute name to observe
   */
  [3]: string | number;

  /**
   * prop type
   */
  [4]: number;

  /**
   * controller id
   */
  [5]: string;
}


export interface ComponentListenersData {
  /**
   * methodName
   */
  [0]: string;

  /**
   * eventName
   */
  [1]: string;

  /**
   * capture
   */
  [2]: number;

  /**
   * passive
   */
  [3]: number;

  /**
   * enabled
   */
  [4]: number;
}


export interface ComponentEventData {
  /**
   * eventName
   */
  [0]: string;

  /**
   * instanceMethodName
   */
  [1]: string;

  /**
   * eventBubbles
   */
  [2]: number;

  /**
   * eventCancelable
   */
  [3]: number;

  /**
   * eventComposed
   */
  [4]: number;
}
