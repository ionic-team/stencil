import * as d from './index';


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
  host?: any;
  style?: string;
  styleMode?: string;
  encapsulation?: Encapsulation;
}


export interface ComponentMeta {
  // "Meta" suffix to ensure property renaming
  tagNameMeta?: string;
  bundleIds?: string | BundleIds;
  stylesMeta?: d.StylesMeta;
  membersMeta?: MembersMeta;
  eventsMeta?: EventMeta[];
  listenersMeta?: ListenMeta[];
  hostMeta?: HostMeta;
  encapsulation?: number;
  assetsDirsMeta?: AssetsMeta[];
  componentConstructor?: ComponentConstructor;
  componentClass?: string;
  dependencies?: ComponentDependencies;
  jsdoc?: JSDoc;
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
  reflectToAttr?: boolean;
  ctrlId?: string;
  jsdoc?: JSDoc;
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


export interface EventMeta {
  eventName: string;
  eventMethodName?: string;
  eventBubbles?: boolean;
  eventCancelable?: boolean;
  eventComposed?: boolean;
  eventType?: AttributeTypeInfo;
  jsdoc?: JSDoc;
}


export interface ListenMeta {
  eventMethodName?: string;
  eventName?: string;
  eventCapture?: boolean;
  eventPassive?: boolean;
  eventDisabled?: boolean;
  jsdoc?: JSDoc;
}


export interface JSDoc {
  name: string;
  documentation: string;
  type: string;
}


export type ComponentDependencies = string[];


export interface ComponentInstance {
  componentWillLoad?: () => Promise<void>;
  componentDidLoad?: () => void;
  componentWillUpdate?: () => Promise<void>;
  componentDidUpdate?: () => void;
  componentDidUnload?: () => void;

  render?: () => any;
  hostData?: () => d.VNodeData;

  mode?: string;
  color?: string;

  [memberName: string]: any;
}


export abstract class ComponentModule {
  abstract componentWillLoad?: () => Promise<void>;
  abstract componentDidLoad?: () => void;
  abstract componentWillUpdate?: () => Promise<void>;
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
  new (): ComponentInstance;
}


export interface ComponentRegistry {
  // registry tag must always be lower-case
  [tagName: string]: ComponentMeta;
}


export interface HostElement extends HTMLElement {
  // web component APIs
  connectedCallback: () => void;
  attributeChangedCallback?: (attribName: string, oldVal: string, newVal: string, namespace: string) => void;
  disconnectedCallback?: () => void;
  host: Element;
  forceUpdate: () => void;

  // public members which can be used externally and should
  // not be property renamed (these should all be in externs)
  // HOWEVER!!! Don't use these :) Nothing to see here
  $activeLoading?: HostElement[];
  $defaultHolder?: Comment;
  $initLoad: () => void;
  $rendered?: boolean;
  $onRender: (() => void)[];
  componentOnReady?: (cb?: (elm: HostElement) => void) => Promise<void>;
  color?: string;
  mode?: string;
}

export interface ComponentAppliedStyles {
  [tagNameForStyles: string]: boolean;
}


export type OnReadyCallback = ((elm: HostElement) => void);


export interface LoadComponentRegistry {
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
  [3]: string|number;

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
