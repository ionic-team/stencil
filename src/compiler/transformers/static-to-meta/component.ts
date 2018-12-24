import * as d from '../../../declarations';
import { gatherComponentBuildConditionals } from '../component-build-conditionals';
import { parseClassMethods } from './class-methods';
import { parseStaticElementRef } from './element-ref';
import { parseStaticEncapsulation } from './encapsulation';
import { parseStaticEvents } from './events';
import { parseStaticListeners } from './listeners';
import { parseStaticMethods } from './methods';
import { parseStaticProps } from './props';
import { parseStaticStates } from './states';
import ts from 'typescript';


export function parseStaticComponentMeta(_config: d.Config, _compilerCtx: d.CompilerCtx, _diagnostics: d.Diagnostic[], moduleFile: d.Module, typeChecker: ts.TypeChecker, _tsSourceFile: ts.SourceFile, cmpNode: ts.ClassDeclaration, staticMembers: ts.ClassElement[], tagName: string) {
  const cmpMeta: d.ComponentCompilerMeta = {
    bundleIds: null,
    tagName: tagName,
    componentClassName: (cmpNode.name ? cmpNode.name.text : ''),
    elementRef: parseStaticElementRef(staticMembers),
    encapsulation: parseStaticEncapsulation(staticMembers),
    properties: parseStaticProps(staticMembers),
    states: parseStaticStates(staticMembers),
    methods: parseStaticMethods(staticMembers),
    listeners: parseStaticListeners(staticMembers),
    events: parseStaticEvents(staticMembers),
    styleDocs: [],
    styles: null,
    jsdoc: null, // serializeSymbol(checker, symbol),

    features: {
      hasAsyncLifecycle: false,
      hasAttributeChangedCallbackFn: false,
      hasComponentWillLoadFn: false,
      hasComponentDidLoadFn: false,
      hasComponentWillUpdateFn: false,
      hasComponentDidUpdateFn: false,
      hasComponentWillUnloadFn: false,
      hasConnectedCallbackFn: false,
      hasDisonnectedCallbackFn: false,
      hasElement: false,
      hasEvent: false,
      hasHostDataFn: false,
      hasLifecycle: false,
      hasListener: false,
      hasMember: false,
      hasMethod: false,
      hasMode: false,
      hasAttr: false,
      hasProp: false,
      hasPropMutable: false,
      hasReflectToAttr: false,
      hasRenderFn: false,
      hasState: false,
      hasStyle: false,
      hasWatchCallback: false,
      isUpdateable: false
    }
  };

  moduleFile.cmpCompilerMeta = cmpMeta;

  gatherComponentBuildConditionals(cmpMeta);

  parseClassMethods(typeChecker, cmpNode, cmpMeta);
}
