import * as d from '@declarations';
import { getComponentTagName, isStaticGetter } from '../transform-utils';
import { parseStaticComponentMeta } from '../static-to-meta/component';
import ts from 'typescript';


export function visitClass(transformCtx: ts.TransformationContext, moduleFile: d.Module, typeChecker: ts.TypeChecker, classNode: ts.ClassDeclaration, transformOpts: d.TransformOptions) {
  if (classNode.members != null) {
    const staticMembers = classNode.members.filter(isStaticGetter);

    const tagName = getComponentTagName(staticMembers);

    if (tagName != null) {
      return parseStaticComponentMeta(transformCtx, moduleFile, typeChecker, classNode, staticMembers, tagName, transformOpts);
    }
  }

  return classNode;
}
