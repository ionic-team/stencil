import * as d from '.';


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
  componentClassName: string;
  elementRef: string;
  encapsulation: Encapsulation;
  dependencies: string[];
  jsdoc: CompilerJsDoc;
  events: ComponentCompilerEvent[];
  listeners: ComponentCompilerListener[];
  methods: ComponentCompilerMethod[];
  properties: ComponentCompilerProperty[];
  states: ComponentCompilerState[];
  styleDocs: CompilerStyleDoc[];
  styles: d.StyleCompiler[];
  tagName: string;
}


export type Encapsulation = 'shadow' | 'scoped' | 'none';


export interface ComponentBundleModeIds {
  [modeName: string]: string;
}

export interface ComponentCompilerStaticProperty {
  mutable: boolean;
  optional: boolean;
  required: boolean;
  type: ComponentCompilerPropertyType;
  complexType?: ComponentCompilerPropertyComplexType;
  attr?: string;
  reflectToAttr?: boolean;
  defaultValue?: string;
}

export interface ComponentCompilerProperty extends ComponentCompilerStaticProperty {
  name: string;
}

export type ComponentCompilerPropertyType = 'any' | 'string' | 'boolean' | 'number' | 'unknown';

export interface ComponentCompilerPropertyComplexType {
  text: string;
  resolved: string;
  references: ComponentCompilerTypeReferences;
}

export interface ComponentCompilerTypeReferences {
  [key: string]: ComponentCompilerTypeReference;
}

export interface ComponentCompilerTypeReference {
  location: 'local' | 'global' | 'import';
  path?: string;
}

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


export interface ComponentCompilerNativeData {
  filePath: string;
  outputText: string;
  tagName: string;
  componentClassName: string;
  cmpCompilerMeta: d.ComponentCompilerMeta;
}
