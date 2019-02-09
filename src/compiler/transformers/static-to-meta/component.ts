import { parseStaticListeners } from './listeners';
import * as d from '@declarations';
import { setComponentBuildConditionals } from '../component-build-conditionals';
import { parseClassMethods } from './class-methods';
import { parseStaticElementRef } from './element-ref';
import { parseStaticEncapsulation } from './encapsulation';
import { parseStaticEvents } from './events';
import { convertValueToLiteral, createStaticGetter, getComponentTagName, isStaticGetter, serializeSymbol } from '../transform-utils';
import { parseStaticMethods } from './methods';
import { parseStaticProps } from './props';
import { parseStaticStates } from './states';
import { parseStaticWatchers } from './watchers';
import { parseStaticStyles } from './styles';
import { parseCallExpression } from './call-expression';
import { parseStringLiteral } from './string-literal';
import ts from 'typescript';


export function parseStaticComponentMeta(transformCtx: ts.TransformationContext, typeChecker: ts.TypeChecker, cmpNode: ts.ClassDeclaration, moduleFile: d.Module, nodeMap: d.NodeMap, transformOpts: d.TransformOptions) {
  if (cmpNode.members == null) {
    return cmpNode;
  }
  const staticMembers = cmpNode.members.filter(isStaticGetter);
  const tagName = getComponentTagName(staticMembers);
  if (tagName == null) {
    return cmpNode;
  }

  const symbol = typeChecker.getSymbolAtLocation(cmpNode.name);
  const cmp: d.ComponentCompilerMeta = {
    tagName: tagName,
    excludeFromCollection: moduleFile.excludeFromCollection,
    isCollectionDependency: moduleFile.isCollectionDependency,
    componentClassName: (cmpNode.name ? cmpNode.name.text : ''),
    elementRef: parseStaticElementRef(staticMembers),
    encapsulation: parseStaticEncapsulation(staticMembers),
    properties: parseStaticProps(staticMembers),
    states: parseStaticStates(staticMembers),
    methods: parseStaticMethods(staticMembers),
    listeners: parseStaticListeners(staticMembers),
    events: parseStaticEvents(staticMembers),
    watchers: parseStaticWatchers(staticMembers),
    styles: parseStaticStyles(tagName, moduleFile.sourceFilePath, staticMembers),
    styleDocs: [],
    dependencies: [],
    docs: serializeSymbol(typeChecker, symbol),
    jsFilePath: null,
    sourceFilePath: null,

    hasAsyncLifecycle: false,
    hasAttributeChangedCallbackFn: false,
    hasComponentWillLoadFn: false,
    hasComponentDidLoadFn: false,
    hasComponentWillUpdateFn: false,
    hasComponentDidUpdateFn: false,
    hasComponentWillRenderFn: false,
    hasComponentDidRenderFn: false,
    hasComponentDidUnloadFn: false,
    hasConnectedCallbackFn: false,
    hasDisonnectedCallbackFn: false,
    hasElement: false,
    hasEvent: false,
    hasLifecycle: false,
    hasListener: false,
    hasListenerTarget: false,
    hasListenerTargetWindow: false,
    hasListenerTargetDocument: false,
    hasListenerTargetBody: false,
    hasListenerTargetParent: false,
    hasMember: false,
    hasMethod: false,
    hasMode: false,
    hasAttribute: false,
    hasProp: false,
    hasPropMutable: false,
    hasReflect: false,
    hasRenderFn: false,
    hasState: false,
    hasStyle: false,
    hasVdomAttribute: true,
    hasVdomClass: true,
    hasVdomFunctional: true,
    hasVdomKey: true,
    hasVdomListener: true,
    hasVdomRef: true,
    hasVdomRender: true,
    hasVdomStyle: true,
    hasVdomText: true,
    hasWatchCallback: false,
    htmlAttrNames: [],
    htmlTagNames: [],
    isUpdateable: false,
    potentialCmpRefs: []
  };

  parseClassMethods(typeChecker, cmpNode, cmp);

  function visitComponentChildNode(node: ts.Node): ts.VisitResult<ts.Node> {
    if (ts.isCallExpression(node)) {
      parseCallExpression(cmp, node);
    } else if (ts.isStringLiteral(node)) {
      parseStringLiteral(cmp, node);
    }
    return ts.visitEachChild(node, visitComponentChildNode, transformCtx);
  }
  ts.visitEachChild(cmpNode, visitComponentChildNode, transformCtx);

  setComponentBuildConditionals(cmp);

  if (transformOpts.addCompilerMeta) {
    // no need to copy all compiler meta data to the static getter
    const copyCmp = Object.assign({}, cmp);
    delete copyCmp.assetsDirs;
    delete copyCmp.dependencies;
    delete copyCmp.excludeFromCollection;
    delete copyCmp.isCollectionDependency;
    delete copyCmp.docs;
    delete copyCmp.jsFilePath;
    delete copyCmp.potentialCmpRefs;
    delete copyCmp.styleDocs;
    delete copyCmp.sourceFilePath;

    const cmpMetaStaticProp = createStaticGetter('COMPILER_META', convertValueToLiteral(copyCmp));
    const classMembers = [...cmpNode.members, cmpMetaStaticProp];

    cmpNode = ts.updateClassDeclaration(
      cmpNode,
      cmpNode.decorators,
      cmpNode.modifiers,
      cmpNode.name,
      cmpNode.typeParameters,
      cmpNode.heritageClauses,
      classMembers
    );
  }

  // add to module map
  moduleFile.cmps.push(cmp);

  // add to node map
  nodeMap.set(cmpNode, cmp);

  return cmpNode;
}
