import { StyleCompiler } from './style';
import { ListenTargetOptions } from './decorators';

/** Must be serializable to JSON!! */
export interface ComponentCompilerFeatures {
  hasAttribute: boolean;
  hasAttributeChangedCallbackFn: boolean;
  hasComponentWillLoadFn: boolean;
  hasComponentDidLoadFn: boolean;
  hasComponentShouldUpdateFn: boolean;
  hasComponentWillUpdateFn: boolean;
  hasComponentDidUpdateFn: boolean;
  hasComponentWillRenderFn: boolean;
  hasComponentDidRenderFn: boolean;
  hasComponentDidUnloadFn: boolean;
  hasConnectedCallbackFn: boolean;
  hasDisconnectedCallbackFn: boolean;
  hasElement: boolean;
  hasEvent: boolean;
  hasLifecycle: boolean;
  hasListener: boolean;
  hasListenerTarget: boolean;
  hasListenerTargetWindow: boolean;
  hasListenerTargetDocument: boolean;
  hasListenerTargetBody: boolean;
  hasListenerTargetParent: boolean;
  hasMember: boolean;
  hasMethod: boolean;
  hasMode: boolean;
  hasProp: boolean;
  hasPropBoolean: boolean;
  hasPropNumber: boolean;
  hasPropString: boolean;
  hasPropMutable: boolean;
  hasReflect: boolean;
  hasRenderFn: boolean;
  hasState: boolean;
  hasStyle: boolean;
  hasVdomAttribute: boolean;
  hasVdomClass: boolean;
  hasVdomFunctional: boolean;
  hasVdomKey: boolean;
  hasVdomListener: boolean;
  hasVdomPropOrAttr: boolean;
  hasVdomRef: boolean;
  hasVdomRender: boolean;
  hasVdomStyle: boolean;
  hasVdomText: boolean;
  hasVdomXlink: boolean;
  hasWatchCallback: boolean;
  htmlAttrNames: string[];
  htmlTagNames: string[];
  isUpdateable: boolean;
  isPlain: boolean;
  potentialCmpRefs: string[];
}

/** Must be serializable to JSON!! */
export interface ComponentCompilerMeta extends ComponentCompilerFeatures {
  assetsDirs: CompilerAssetDir[];
  componentClassName: string;
  elementRef: string;
  encapsulation: Encapsulation;
  shadowDelegatesFocus: boolean;
  excludeFromCollection: boolean;
  isCollectionDependency: boolean;
  isLegacy: boolean;
  docs: CompilerJsDoc;
  jsFilePath: string;
  listeners: ComponentCompilerListener[];
  events: ComponentCompilerEvent[];
  methods: ComponentCompilerMethod[];
  virtualProperties: ComponentCompilerVirtualProperty[];
  properties: ComponentCompilerProperty[];
  watchers: ComponentCompilerWatch[];
  sourceFilePath: string;
  states: ComponentCompilerState[];
  styleDocs: CompilerStyleDoc[];
  styles: StyleCompiler[];
  tagName: string;
  internal: boolean;
  legacyConnect: ComponentCompilerLegacyConnect[];
  legacyContext: ComponentCompilerLegacyContext[];

  dependencies?: string[];
  dependents?: string[];
  directDependencies?: string[];
  directDependents?: string[];
}

export interface ComponentCompilerLegacyConnect {
  name: string;
  connect: string;
}

export interface ComponentCompilerLegacyContext {
  name: string;
  context: string;
}

export type Encapsulation = 'shadow' | 'scoped' | 'none';


export interface ComponentCompilerStaticProperty {
  mutable: boolean;
  optional: boolean;
  required: boolean;
  type: ComponentCompilerPropertyType;
  complexType: ComponentCompilerPropertyComplexType;
  attribute?: string;
  reflect?: boolean;
  docs: CompilerJsDoc;
  defaultValue?: string;
}

export interface ComponentCompilerProperty extends ComponentCompilerStaticProperty {
  name: string;
  internal: boolean;
}

export interface ComponentCompilerVirtualProperty {
  name: string;
  type: string;
  docs: string;
}

export type ComponentCompilerPropertyType = 'any' | 'string' | 'boolean' | 'number' | 'unknown';

export interface ComponentCompilerPropertyComplexType {
  original: string;
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

export interface ComponentCompilerStaticEvent {
  name: string;
  method: string;
  bubbles: boolean;
  cancelable: boolean;
  composed: boolean;
  docs: CompilerJsDoc;
  complexType: ComponentCompilerEventComplexType;
}

export interface ComponentCompilerEvent extends ComponentCompilerStaticEvent {
  internal: boolean;
}

export interface ComponentCompilerEventComplexType {
  original: string;
  resolved: string;
  references: ComponentCompilerTypeReferences;
}

export interface ComponentCompilerListener {
  name: string;
  method: string;
  capture: boolean;
  passive: boolean;
  target: ListenTargetOptions | undefined;
}

export interface ComponentCompilerStaticMethod {
  docs: CompilerJsDoc;
  complexType: ComponentCompilerMethodComplexType;
}

export interface ComponentCompilerMethodComplexType {
  signature: string;
  parameters: CompilerJsDoc[];
  references: ComponentCompilerTypeReferences;
  return: string;
}

export interface ComponentCompilerWatch {
  propName: string;
  methodName: string;
}

export interface ComponentCompilerMethod extends ComponentCompilerStaticMethod {
  name: string;
  internal: boolean;
}

export interface ComponentCompilerState {
  name: string;
}

export interface CompilerJsDoc {
  text: string;
  tags: CompilerJsDocTagInfo[];
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
}

export interface ComponentCompilerData {
  exportLine: string;
  filePath: string;
  cmp: ComponentCompilerMeta;
  uniqueComponentClassName?: string;
  importLine?: string;
}
