import { Module } from './module';


export interface CollectionCompilerMeta {
  collectionName?: string;
  moduleDir?: string;
  moduleFiles?: Module[];
  global?: Module;
  compiler?: CollectionCompilerVersion;
  isInitialized?: boolean;
  hasExports?: boolean;
  dependencies?: string[];
  bundles?: {
    components: string[];
  }[];
}


export interface CollectionCompilerVersion {
  name: string;
  version: string;
  typescriptVersion?: string;
}


export interface CollectionManifest {
  entries?: CollectionComponentEntryPath[];
  collections?: CollectionDependencyManifest[];
  global?: string;
  compiler?: CollectionCompilerVersion;
  bundles?: CollectionBundleManifest[];

  /**
   * DEPRECATED
   */
  components?: ComponentDataDeprecated[];
}


export type CollectionComponentEntryPath = string;


export interface CollectionBundleManifest {
  components: string[];
}


export interface CollectionDependencyManifest {
  name: string;
  tags: string[];
}



/**** DEPRECATED *****/

export interface ComponentDataDeprecated {
  tag?: string;
  componentPath?: string;
  componentClass?: string;
  dependencies?: string[];
  styles?: StylesDataDeprecated;
  props?: PropManifestDeprecated[];
  states?: StateManifestDeprecated[];
  listeners?: ListenerManifestDeprecated[];
  methods?: MethodManifestDeprecated[];
  events?: EventManifestDeprecated[];
  connect?: ConnectManifestDeprecated[];
  context?: ContextManifestDeprecated[];
  hostElement?: HostElementManifestDeprecated;
  host?: any;
  assetPaths?: string[];
  slot?: 'hasSlots'|'hasNamedSlots';
  shadow?: boolean;
  scoped?: boolean;
  priority?: 'low';
}

export interface StylesDataDeprecated {
  [modeName: string]: StyleDataDeprecated;
}

export interface StyleDataDeprecated {
  stylePaths?: string[];
  style?: string;
}

export interface PropManifestDeprecated {
  name?: string;
  type?: 'Boolean'|'Number'|'String'|'Any';
  mutable?: boolean;
  attr?: string;
  reflectToAttr?: boolean;
  watch?: string[];
}

export interface StateManifestDeprecated {
  name: string;
}

export interface ListenerManifestDeprecated {
  event: string;
  method: string;
  capture?: boolean;
  passive?: boolean;
  enabled?: boolean;
}

export interface MethodManifestDeprecated {
  name: string;
}

export interface EventManifestDeprecated {
  event: string;
  method?: string;
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
}

export interface ConnectManifestDeprecated {
  name: string;
  tag?: string;
}

export interface ContextManifestDeprecated {
  name: string;
  id?: string;
}

export interface HostElementManifestDeprecated {
  name: string;
}
