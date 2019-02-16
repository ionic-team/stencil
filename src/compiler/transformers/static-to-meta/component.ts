import { parseStaticListeners } from './listeners';
import * as d from '@declarations';
import { setComponentBuildConditionals } from '../component-build-conditionals';
import { parseClassMethods } from './class-methods';
import { parseStaticElementRef } from './element-ref';
import { parseStaticEncapsulation } from './encapsulation';
import { parseStaticEvents } from './events';
import { convertValueToLiteral, createStaticGetter, getComponentTagName, isStaticGetter, serializeSymbol, isInternal } from '../transform-utils';
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

  const regex = new RegExp(/^[a-z](?:[\-\.0-9_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*-(?:[\-\.0-9_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*$/);
  if (!regex.test(tagName)) {
    throw new SyntaxError(`"${tagName}" is not a valid tag name. Please refer to
    https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name for more info.`);
  }

  const symbol = typeChecker.getSymbolAtLocation(cmpNode.name);
  const docs = serializeSymbol(typeChecker, symbol);
  const cmp: d.ComponentCompilerMeta = {
    tagName: tagName,
    excludeFromCollection: moduleFile.excludeFromCollection,
    isCollectionDependency: moduleFile.isCollectionDependency,
    componentClassName: (cmpNode.name ? cmpNode.name.text : ''),
    elementRef: parseStaticElementRef(staticMembers),
    encapsulation: parseStaticEncapsulation(staticMembers),
    properties: parseStaticProps(staticMembers),
    virtualProperties: parseVirtualProps(docs),
    states: parseStaticStates(staticMembers),
    methods: parseStaticMethods(staticMembers),
    listeners: parseStaticListeners(staticMembers),
    events: parseStaticEvents(staticMembers),
    watchers: parseStaticWatchers(staticMembers),
    styles: parseStaticStyles(tagName, moduleFile.sourceFilePath, staticMembers),
    internal: isInternal(docs),
    styleDocs: [],
    dependencies: [],
    docs,
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
    hasVdomRender: true, // TODO: use import check
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

function parseVirtualProps(docs: d.CompilerJsDoc) {
  return docs.tags
    .filter(({name}) => name === 'virtualProp')
    .map(parseVirtualProp)
    .filter(prop => !!prop);
}

function parseVirtualProp(tag: d.CompilerJsDocTagInfo): d.ComponentCompilerVirtualProperty {
  const results = /^\s*(?:\{([^}]+)\}\s+)?(\w+)\s+-\s+(.*)$/.exec(tag.text);
  if (!results) {
    return undefined;
  }
  const [, type, name, docs] = results;
  return {
    type: type == null ? 'any' : type.trim(),
    name: name.trim(),
    docs: docs.trim()
  };
}
