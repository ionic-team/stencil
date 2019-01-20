import * as d from '.';

export interface ComponentConstructorOLD {
  is?: string;
  properties?: any;
  events?: any[];
  listeners?: any[];
  host?: ComponentConstructorHost;
  style?: string;
  styleMode?: string;
  encapsulation?: d.Encapsulation;
  cmpMeta?: d.ComponentRuntimeMeta;
  observedAttributes?: string[];
}


export interface ComponentConstructorHost {
  theme?: string;
  [attrName: string]: string | undefined;
}


export interface ComponentMeta {
  // "Meta" suffix to ensure property renaming
  tagNameMeta?: string;
  bundleIds?: string | BundleIds | GetModuleFn;
  stylesMeta?: any;
  membersMeta?: MembersMeta;
  eventsMeta?: EventMeta[];
  listenersMeta?: ListenMeta[];
  hostMeta?: HostMeta;
  encapsulationMeta?: number;
  assetsDirsMeta?: AssetsMeta[];
  componentConstructor?: ComponentConstructorOLD;
  componentClass?: string;
  dependencies?: string[];
  jsdoc?: d.JsDoc;
  styleDocs?: StyleDoc[];
  hmrLoad?: () => void;
}


export type GetModuleFn = (opts?: GetModuleOptions) => Promise<ComponentConstructorOLD>;


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
  jsdoc?: d.JsDoc;
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
  optional: boolean;
  required: boolean;
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


// export interface ComponentConstructorProperties {
//   [propName: string]: ComponentConstructorProperty;
// }


// export interface ComponentConstructorProperty {
//   attr?: string;
//   connect?: string;
//   context?: string;
//   elementRef?: boolean;
//   method?: boolean;
//   mutable?: boolean;
//   reflectToAttr?: boolean;
//   state?: boolean;
//   type?: PropertyType;
//   watchCallbacks?: string[];
// }

export type PropertyType = StringConstructor | BooleanConstructor | NumberConstructor | 'Any';


// export interface ComponentConstructorEvent {
//   name: string;
//   method: string;
//   bubbles: boolean;
//   cancelable: boolean;
//   composed: boolean;
// }


// export interface ComponentConstructorListener {
//   name: string;
//   method: string;
//   capture?: boolean;
//   disabled?: boolean;
//   passive?: boolean;
// }


export interface EventMeta {
  eventName: string;
  eventMethodName?: string;
  eventBubbles?: boolean;
  eventCancelable?: boolean;
  eventComposed?: boolean;
  eventType?: AttributeTypeInfo;
  jsdoc?: d.JsDoc;
}


export interface ListenMeta {
  eventMethodName?: string;
  eventName?: string;
  eventCapture?: boolean;
  eventPassive?: boolean;
  eventDisabled?: boolean;
  jsdoc?: d.JsDoc;
}


// export interface JsDoc {
//   name: string;
//   documentation: string;
//   type: string;
//   tags: JSDocTagInfo[];
//   default?: string;
//   parameters?: JsDoc[];
//   returns?: {
//     type: string;
//     documentation: string;
//   };
// }

// export interface JSDocTagInfo {
//   name: string;
//   text?: string;
// }


export interface StyleDoc {
  name: string;
  docs: string;
  annotation: 'prop';
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

  abstract __el?: d.HostElement;

  [memberName: string]: any;

  abstract get is(): string;
  abstract get properties(): string;
}


export interface ComponentInternalValues {
  [propName: string]: any;
}


export interface ComponentModule {
  new(): d.ComponentInstance;
}


export interface ComponentRegistry {
  // registry tag must always be lower-case
  [tagName: string]: ComponentMeta;
}




export interface ComponentAppliedStyles {
  [tagNameForStyles: string]: boolean;
}


export type OnReadyCallback = ((elm: d.HostElement) => void);


export type ComponentHostData = [
  /**
   * tag name (ion-badge)
   */
  string,

  /**
   * map of bundle ids
   */
  BundleIds,

  /**
   * has styles
   */
  boolean,

  /**
   * members
   */
  ComponentMemberData[],

  /**
   * encapsulated
   */
  number,

  /**
   * listeners
   */
  ComponentListenersData[]
];


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
