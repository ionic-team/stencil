import * as d from '.';

/** Must be serializable to JSON!! */
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
  hasVdomAttribute: boolean;
  hasVdomClass: boolean;
  hasVdomFunctional: boolean;
  hasVdomKey: boolean;
  hasVdomListener: boolean;
  hasVdomRef: boolean;
  hasVdomRender: boolean;
  hasVdomStyle: boolean;
  hasVdomText: boolean;
  hasWatchCallback: boolean;
  htmlAttrNames: string[];
  htmlTagNames: string[];
  isUpdateable: boolean;
  potentialCmpRefs: d.PotentialComponentRef[];
}

/** Must be serializable to JSON!! */
export interface ComponentCompilerMeta extends ComponentCompilerFeatures {
  assetsDirs?: CompilerAssetDir[];
  componentClassName: string;
  dependencies: string[];
  elementRef: string;
  encapsulation: Encapsulation;
  events: ComponentCompilerEvent[];
  excludeFromCollection: boolean;
  isCollectionDependency: boolean;
  jsFilePath: string;
  jsdoc: CompilerJsDoc;
  listeners: ComponentCompilerListener[];
  methods: ComponentCompilerMethod[];
  properties: ComponentCompilerProperty[];
  states: ComponentCompilerState[];
  styleDocs: CompilerStyleDoc[];
  styles: d.StyleCompiler[];
  tagName: string;
}


export type Encapsulation = 'shadow' | 'scoped' | 'none';


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
  cmp: d.ComponentCompilerMeta;
}


export interface ComponentCompilerLazyData {
  exportLine: string;
  filePath: string;
  tagName: string;
}
