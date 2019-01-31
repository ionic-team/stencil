import * as d from '@declarations';
import { convertValueToLiteral, createStaticGetter, serializeSymbol } from '../transform-utils';
import { setComponentBuildConditionals } from '../component-build-conditionals';
import { parseClassMethods } from './class-methods';
import { parseStaticElementRef } from './element-ref';
import { parseStaticEncapsulation } from './encapsulation';
import { parseStaticEvents } from './events';
import { parseStaticListeners } from './listeners';
import { parseStaticMethods } from './methods';
import { parseStaticProps } from './props';
import { parseStaticStates } from './states';
import { parseStaticStyles } from './styles';
import { visitCallExpression } from '../visitors/visit-call-expression';
import { visitStringLiteral } from '../visitors/visit-string-literal';
import ts from 'typescript';


export function parseStaticComponentMeta(transformCtx: ts.TransformationContext, moduleFile: d.Module, typeChecker: ts.TypeChecker, cmpNode: ts.ClassDeclaration, staticMembers: ts.ClassElement[], tagName: string, transformOpts: d.TransformOptions) {
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
    styles: parseStaticStyles(moduleFile.sourceFilePath, staticMembers),
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
    hasAttribute: false,
    hasProp: false,
    hasPropMutable: false,
    hasReflect: false,
    hasRenderFn: false,
    hasState: false,
    hasStyle: false,
    hasVdomAttribute: false,
    hasVdomClass: false,
    hasVdomFunctional: false,
    hasVdomKey: false,
    hasVdomListener: false,
    hasVdomRef: false,
    hasVdomRender: false,
    hasVdomStyle: false,
    hasVdomText: false,
    hasWatchCallback: false,
    htmlAttrNames: [],
    htmlTagNames: [],
    isUpdateable: false,
    potentialCmpRefs: []
  };

  moduleFile.cmps.push(cmp);

  parseClassMethods(typeChecker, cmpNode, cmp);


  function visitComponentChildNode(node: ts.Node): ts.VisitResult<ts.Node> {

    switch (node.kind) {
      case ts.SyntaxKind.CallExpression:
        visitCallExpression(cmp, node as ts.CallExpression);
        break;

      case ts.SyntaxKind.StringLiteral:
        visitStringLiteral(cmp, node as ts.StringLiteral);
        break;
    }

    return ts.visitEachChild(node, visitComponentChildNode, transformCtx);
  }

  cmpNode = ts.visitEachChild(cmpNode, visitComponentChildNode, transformCtx);

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

  return cmpNode;
}
