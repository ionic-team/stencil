import * as d from './index';
import { ENCAPSULATION, MEMBER_TYPE, PROP_TYPE } from '../util/constants';


export interface ComponentMeta {
  // "Meta" suffix to ensure property renaming
  tagNameMeta?: string;
  bundleIds?: BundleIds;
  stylesMeta?: StylesMeta;
  membersMeta?: MembersMeta;
  eventsMeta?: EventMeta[];
  listenersMeta?: ListenMeta[];
  hostMeta?: HostMeta;
  encapsulation?: ENCAPSULATION;
  assetsDirsMeta?: AssetsMeta[];
  componentConstructor?: ComponentConstructor;
  componentClass?: string;
  jsdoc?: JSDoc;
}


export interface ModeStyles {
  [modeName: string]: string | string[];
}

export interface BundleIds {
  [modeName: string]: string;
}


export interface MembersMeta {
  [memberName: string]: MemberMeta;
}


export interface MemberMeta {
  memberType?: MEMBER_TYPE;
  propType?: PROP_TYPE;
  attribName?: string;
  attribType?: AttributeTypeInfo;
  ctrlId?: string;
  jsdoc?: JSDoc;
  watchCallbacks?: string[];
}

export interface AttributeTypeReference {
  referenceLocation: 'local' | 'global' | 'import';
  importReferenceLocation?: string;
}

export interface AttributeTypeInfo {
  text: string;
  typeReferences?: {
    [key: string]: AttributeTypeReference;
  };
}


export interface StylesMeta {
  [modeName: string]: StyleMeta;
}


export interface StyleMeta {
  styleId?: string;
  absolutePaths?: string[];
  cmpRelativePaths?: string[];
  originalComponentPaths?: string[];
  originalCollectionPaths?: string[];
  styleStr?: string;
  compiledStyleText?: string;
  compiledStyleTextScoped?: string;
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


export interface ComponentConstructor {
  is?: string;
  properties?: ComponentConstructorProperties;
  events?: ComponentConstructorEvent[];
  host?: any;
  style?: string;
  styleMode?: string;
  encapsulation?: Encapsulation;
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
  eventMethodName: string;
  eventBubbles: boolean;
  eventCancelable: boolean;
  eventComposed: boolean;
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

  // private properties
  __el?: HostElement;

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


export interface ComponentActiveListeners {
  [eventName: string]: Function;
}


export interface ComponentActivePropChanges {
  [propName: string]: Function;
}


export interface ComponentInternalValues {
  [propName: string]: any;
}


export interface BaseInputComponent extends ComponentInstance {
  disabled: boolean;
  hasFocus: boolean;
  value: string;

  fireFocus: () => void;
  fireBlur: () => void;
}


export interface BooleanInputComponent extends BaseInputComponent {
  checked: boolean;
  toggle: (ev: UIEvent) => void;
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
  forceUpdate: () => void;

  // public members which can be used externally and should
  // not be property renamed (these should all be in externs)
  // HOWEVER!!! Don't use these :)
  $activeLoading?: HostElement[];
  $connected?: boolean;
  $defaultHolder?: Comment;
  $initLoad: () => void;
  $rendered?: boolean;
  $onRender: (() => void)[];
  componentOnReady?: (cb?: (elm: HostElement) => void) => Promise<void>;
  color?: string;
  mode?: string;

  // private members which are only internal to
  // this runtime and can be safely property renamed
  _ancestorHostElement?: HostElement;
  _appliedStyles?: { [tagNameForStyles: string]: boolean };
  _hasDestroyed?: boolean;
  _hasLoaded?: boolean;
  _hostContentNodes?: d.HostContentNodes;
  _instance?: ComponentInstance;
  _isQueuedForUpdate?: boolean;
  _observer?: MutationObserver;
  _onReadyCallbacks: ((elm: HostElement) => void)[];
  _queuedEvents?: any[];
  _root?: HTMLElement | ShadowRoot;
  _values?: ComponentInternalValues;
  _vnode: d.VNode;
}

export interface ComponentWillLoad {
  componentWillLoad: () => Promise<void> | void;
}

export interface ComponentDidLoad {
  componentDidLoad: () => void;
}

export interface ComponentWillUpdate {
  componentWillUpdate: () => Promise<void> | void;
}

export interface ComponentDidUpdate {
  componentDidUpdate: () => void;
}

export interface ComponentDidUnload {
  componentDidUnload: () => void;
}


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
  [4]: ENCAPSULATION;

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
   * is attribute to observe
   */
  [2]: number;

  /**
   * prop type
   */
  [3]: number;

  /**
   * controller id
   */
  [4]: string;
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
