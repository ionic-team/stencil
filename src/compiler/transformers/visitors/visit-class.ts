import * as d from '@declarations';
import { getStaticValue } from '../transform-utils';
import { parseStaticComponentMeta } from '../static-to-meta/component';
import ts from 'typescript';


export function visitClass(transformCtx: ts.TransformationContext, moduleFile: d.Module, typeChecker: ts.TypeChecker, classNode: ts.ClassDeclaration, addStaticBuildConditionals: boolean) {
  if (classNode.members != null) {
    const staticMembers = classNode.members.filter(isStaticGetter);

    if (staticMembers.length > 0) {
      const tagName = getStaticValue(staticMembers, 'is') as string;

      if (typeof tagName === 'string' && tagName.includes('-')) {
        return parseStaticComponentMeta(transformCtx, moduleFile, typeChecker, classNode, staticMembers, tagName, addStaticBuildConditionals);
      }
    }
  }

  return classNode;
}


function isStaticGetter(member: ts.ClassElement) {
  return (
    member.kind === ts.SyntaxKind.GetAccessor &&
    member.modifiers && member.modifiers.some(({kind}) => kind === ts.SyntaxKind.StaticKeyword)
  );
}
