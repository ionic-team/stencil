import * as d from '../../../declarations';
import { addComponentMetaStatic } from '../add-component-meta-static';
import { dirname, isAbsolute, join, relative } from 'path';
import { normalizePath, unique } from '@utils';
import { parseStaticMethods } from './methods';
import { parseStaticListeners } from './listeners';
import { parseClassMethods } from './class-methods';
import { parseStaticElementRef } from './element-ref';
import { parseStaticEncapsulation, parseStaticShadowDelegatesFocus } from './encapsulation';
import { parseStaticEvents } from './events';
import { getComponentTagName, getStaticValue, isInternal, isStaticGetter, serializeSymbol } from '../transform-utils';
import { parseStaticProps } from './props';
import { parseStaticStates } from './states';
import { parseStaticWatchers } from './watchers';
import { parseStaticStyles } from './styles';
import { parseCallExpression } from './call-expression';
import { parseStringLiteral } from './string-literal';
import { setComponentBuildConditionals } from '../component-build-conditionals';
import ts from 'typescript';

export const parseStaticComponentMeta = (
  compilerCtx: d.CompilerCtx,
  typeChecker: ts.TypeChecker,
  cmpNode: ts.ClassDeclaration,
  moduleFile: d.Module,
  nodeMap: d.NodeMap,
  transformOpts?: d.TransformOptions,
) => {
  if (cmpNode.members == null) {
    return cmpNode;
  }
  const staticMembers = cmpNode.members.filter(isStaticGetter);
  const tagName = getComponentTagName(staticMembers);
  if (tagName == null) {
    return cmpNode;
  }

  const symbol = typeChecker ? typeChecker.getSymbolAtLocation(cmpNode.name) : undefined;
  const docs = serializeSymbol(typeChecker, symbol);
  const isCollectionDependency = moduleFile.isCollectionDependency;
  const encapsulation = parseStaticEncapsulation(staticMembers);

  const cmp: d.ComponentCompilerMeta = {
    isLegacy: false,
    tagName: tagName,
    excludeFromCollection: moduleFile.excludeFromCollection,
    isCollectionDependency,
    componentClassName: cmpNode.name ? cmpNode.name.text : '',
    elementRef: parseStaticElementRef(staticMembers),
    encapsulation,
    shadowDelegatesFocus: parseStaticShadowDelegatesFocus(encapsulation, staticMembers),
    properties: parseStaticProps(staticMembers),
    virtualProperties: parseVirtualProps(docs),
    states: parseStaticStates(staticMembers),
    methods: parseStaticMethods(staticMembers),
    listeners: parseStaticListeners(staticMembers),
    events: parseStaticEvents(staticMembers),
    watchers: parseStaticWatchers(staticMembers),
    styles: parseStaticStyles(compilerCtx, tagName, moduleFile.sourceFilePath, isCollectionDependency, staticMembers),
    legacyConnect: getStaticValue(staticMembers, 'connectProps') || [],
    legacyContext: getStaticValue(staticMembers, 'contextProps') || [],
    internal: isInternal(docs),
    assetsDirs: parseAssetsDirs(staticMembers, moduleFile.jsFilePath),
    styleDocs: [],
    docs,
    jsFilePath: moduleFile.jsFilePath,
    sourceFilePath: moduleFile.sourceFilePath,

    hasAttributeChangedCallbackFn: false,
    hasComponentWillLoadFn: false,
    hasComponentDidLoadFn: false,
    hasComponentShouldUpdateFn: false,
    hasComponentWillUpdateFn: false,
    hasComponentDidUpdateFn: false,
    hasComponentWillRenderFn: false,
    hasComponentDidRenderFn: false,
    hasComponentDidUnloadFn: false,
    hasConnectedCallbackFn: false,
    hasDisconnectedCallbackFn: false,
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
    hasPropNumber: false,
    hasPropBoolean: false,
    hasPropString: false,
    hasPropMutable: false,
    hasReflect: false,
    hasRenderFn: false,
    hasState: false,
    hasStyle: false,
    hasVdomAttribute: false,
    hasVdomXlink: false,
    hasVdomClass: false,
    hasVdomFunctional: false,
    hasVdomKey: false,
    hasVdomListener: false,
    hasVdomPropOrAttr: false,
    hasVdomRef: false,
    hasVdomRender: false,
    hasVdomStyle: false,
    hasVdomText: false,
    hasWatchCallback: false,
    isPlain: false,
    htmlAttrNames: [],
    htmlTagNames: [],
    htmlParts: [],
    isUpdateable: false,
    potentialCmpRefs: [],
  };

  const visitComponentChildNode = (node: ts.Node) => {
    if (ts.isCallExpression(node)) {
      parseCallExpression(cmp, node);
    } else if (ts.isStringLiteral(node)) {
      parseStringLiteral(cmp, node);
    }
    node.forEachChild(visitComponentChildNode);
  };
  visitComponentChildNode(cmpNode);
  parseClassMethods(cmpNode, cmp);

  cmp.legacyConnect.forEach(({ connect }) => {
    cmp.htmlTagNames.push(connect);
    if (connect.includes('-')) {
      cmp.potentialCmpRefs.push(connect);
    }
  });

  cmp.htmlAttrNames = unique(cmp.htmlAttrNames);
  cmp.htmlTagNames = unique(cmp.htmlTagNames);
  cmp.potentialCmpRefs = unique(cmp.potentialCmpRefs);
  setComponentBuildConditionals(cmp);

  if (transformOpts && transformOpts.componentMetadata === 'compilerstatic') {
    cmpNode = addComponentMetaStatic(cmpNode, cmp);
  }

  // add to module map
  moduleFile.cmps.push(cmp);

  // add to node map
  nodeMap.set(cmpNode, cmp);

  return cmpNode;
};

const parseVirtualProps = (docs: d.CompilerJsDoc) => {
  return docs.tags
    .filter(({ name }) => name === 'virtualProp')
    .map(parseVirtualProp)
    .filter(prop => !!prop);
};

const parseVirtualProp = (tag: d.CompilerJsDocTagInfo): d.ComponentCompilerVirtualProperty => {
  const results = /^\s*(?:\{([^}]+)\}\s+)?(\w+)\s+-\s+(.*)$/.exec(tag.text);
  if (!results) {
    return undefined;
  }
  const [, type, name, docs] = results;
  return {
    type: type == null ? 'any' : type.trim(),
    name: name.trim(),
    docs: docs.trim(),
  };
};

const parseAssetsDirs = (staticMembers: ts.ClassElement[], componentFilePath: string): d.AssetsMeta[] => {
  const dirs: string[] = getStaticValue(staticMembers, 'assetsDirs') || [];
  const componentDir = normalizePath(dirname(componentFilePath));

  return dirs.map(dir => {
    // get the relative path from the component file to the assets directory
    dir = normalizePath(dir.trim());

    let absolutePath = dir;
    let cmpRelativePath = dir;
    if (isAbsolute(dir)) {
      // if this is an absolute path already, let's convert it to be relative
      cmpRelativePath = relative(componentDir, dir);
    } else {
      // create the absolute path to the asset dir
      absolutePath = join(componentDir, dir);
    }
    return {
      absolutePath,
      cmpRelativePath,
      originalComponentPath: dir,
    };
  });
};
