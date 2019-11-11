import { ModeBundleIds } from './runtime';


/** OLD WAY */
export interface Collection {
  collectionName?: string;
  moduleDir?: string;
  moduleFiles?: any[];
  global?: any;
  compiler?: CollectionCompiler;
  isInitialized?: boolean;
  hasExports?: boolean;
  dependencies?: string[];
  bundles?: {
    components: string[];
  }[];
}


export interface CollectionCompiler {
  name: string;
  version: string;
  typescriptVersion?: string;
}


export interface AppRegistry {
  namespace?: string;
  fsNamespace?: string;
  loader?: string;
  core?: string;
  corePolyfilled?: string;
  global?: string;
  components?: AppRegistryComponents;
}


export interface AppRegistryComponents {
  [tagName: string]: {
    bundleIds: ModeBundleIds,
    encapsulation?: 'shadow' | 'scoped';
  };
}


/** OLD WAY */
export interface ModuleFile {
  sourceFilePath: string;
  jsFilePath?: string;
  dtsFilePath?: string;
  cmpMeta?: any;
  isCollectionDependency?: boolean;
  excludeFromCollection?: boolean;
  originalCollectionComponentPath?: string;
  externalImports?: string[];
  localImports?: string[];
  potentialCmpRefs?: string[];
  hasSlot?: boolean;
  hasSvg?: boolean;
}


export interface ModuleBundles {
  [bundleId: string]: string;
}


// this maps the json data to our internal data structure
// so that the internal data structure "could" change,
// but the external user data will always use the same api
// consider these property values to be locked in as is
// there should be a VERY good reason to have to rename them
// DO NOT UPDATE PROPERTY KEYS COMING FROM THE EXTERNAL DATA!!
// DO NOT UPDATE PROPERTY KEYS COMING FROM THE EXTERNAL DATA!!
// DO NOT UPDATE PROPERTY KEYS COMING FROM THE EXTERNAL DATA!!

export interface CollectionData {
  components?: ComponentData[];
  collections?: CollectionDependencyData[];
  global?: string;
  modules?: string[];
  compiler?: {
    name: string;
    version: string;
    typescriptVersion?: string;
  };
  bundles?: CollectionBundle[];
}


export interface CollectionBundle {
  components: string[];
}


export interface CollectionDependencyData {
  name: string;
  tags: string[];
}


export interface ComponentData {
  tag?: string;
  componentPath?: string;
  componentClass?: string;
  dependencies?: string[];
  styles?: StylesData;
  props?: PropData[];
  states?: StateData[];
  listeners?: ListenerData[];
  methods?: MethodData[];
  events?: EventData[];
  connect?: ConnectData[];
  context?: ContextData[];
  hostElement?: HostElementData;
  host?: any;
  assetPaths?: string[];
  slot?: 'hasSlots'|'hasNamedSlots';
  shadow?: boolean;
  scoped?: boolean;
  priority?: 'low';
}

export interface StylesData {
  [modeName: string]: StyleData;
}

export interface StyleData {
  stylePaths?: string[];
  style?: string;
}

export interface PropData {
  name?: string;
  type?: 'Boolean'|'Number'|'String'|'Any';
  mutable?: boolean;
  attr?: string;
  reflectToAttr?: boolean;
  watch?: string[];
}

export interface StateData {
  name: string;
}

export interface ListenerData {
  event: string;
  method: string;
  capture?: boolean;
  passive?: boolean;
  enabled?: boolean;
}

export interface MethodData {
  name: string;
}

export interface EventData {
  event: string;
  method?: string;
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
}

export interface ConnectData {
  name: string;
  tag?: string;
}

export interface ContextData {
  name: string;
  id?: string;
}

export interface HostElementData {
  name: string;
}
