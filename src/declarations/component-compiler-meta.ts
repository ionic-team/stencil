

export interface ComponentCompilerFeatures {
  hasAsyncLifecycle: boolean;
  hasAttr: boolean;
  hasAttributeChangedCallbackFn: boolean;
  hasComponentWillLoadFn: boolean;
  hasComponentDidLoadFn: boolean;
  hasComponentWillUpdateFn: boolean;
  hasComponentDidUpdateFn: boolean;
  hasComponentWillUnloadFn: boolean;
  hasConnectedCallbackFn: boolean;
  hasDisonnectedCallbackFn: boolean;
  hasElement: boolean;
  hasEvent: boolean;
  hasHostDataFn: boolean;
  hasLifecycle: boolean;
  hasListener: boolean;
  hasMember: boolean;
  hasMethod: boolean;
  hasMode: boolean;
  hasProp: boolean;
  hasPropMutable: boolean;
  hasReflectToAttr: boolean;
  hasRenderFn: boolean;
  hasState: boolean;
  hasStyle: boolean;
  hasWatchCallback: boolean;
  isUpdateable: boolean;
}

export interface ComponentCompilerMeta extends ComponentCompilerFeatures {
  assetsDirs?: CompilerAssetDir[];
  bundleIds: ComponentBundleId;
  componentClassName: string;
  elementRef: string;
  encapsulation: string;
  events: ComponentCompilerEvent[];
  jsdoc: CompilerJsDoc;
  listeners: ComponentCompilerListener[];
  methods: ComponentCompilerMethod[];
  properties: ComponentCompilerProperty[];
  states: ComponentCompilerState[];
  styleDocs: CompilerStyleDoc[];
  styles: any;
  tagName: string;
}

export type ComponentBundleId = string | ComponentBundleModeIds;

export interface ComponentBundleModeIds {
  [modeName: string]: string;
}

export interface ComponentCompilerProperty {
  name: string;
  attr?: string;
  method?: boolean;
  mutable?: boolean;
  optional?: boolean;
  reflectToAttr?: boolean;
  required?: boolean;
  type?: ComponentCompilerPropertyType;
  complexType?: ComponentCompilerPropertyComplexType;
}

export type ComponentCompilerPropertyType = 'string' | 'boolean' | 'number' | 'array' | 'object' | 'function' | 'unknown';

export type ComponentCompilerPropertyComplexType = string;

export interface ComponentCompilerEvent {
  name: string;
  method: string;
  bubbles: boolean;
  cancelable: boolean;
  composed: boolean;
}

export interface ComponentCompilerListener {
  name: string;
  method: string;
  capture?: boolean;
  disabled?: boolean;
  passive?: boolean;
}

export interface ComponentCompilerMethod {
  name: string;
}

export interface ComponentCompilerState {
  name: string;
  optional?: boolean;
  required?: boolean;
  type?: ComponentCompilerPropertyType;
  complexType?: ComponentCompilerPropertyComplexType;
}

export interface CompilerJsDoc {
  name: string;
  documentation: string;
  type: string;
  tags: CompilerJsDocTagInfo[];
  default?: string;
  parameters?: CompilerJsDoc[];
  returns?: {
    type: string;
    documentation: string;
  };
}

export interface CompilerJsDocTagInfo {
  name: string;
  text?: string;
}

export interface CompilerStyleDoc {
  name: string;
  docs: string;
  annotation: 'prop';
}

export interface CompilerAssetDir {
  absolutePath?: string;
  cmpRelativePath?: string;
  originalComponentPath?: string;
  originalCollectionPath?: string;
}
