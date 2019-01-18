import * as d from '@declarations';
import { getStaticValue } from '../transform-utils';
import { parseStaticComponentMeta } from '../static-to-meta/component';
import ts from 'typescript';


export function visitClass(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, moduleFile: d.Module, typeChecker: ts.TypeChecker, tsSourceFile: ts.SourceFile, classNode: ts.ClassDeclaration) {
  if (!classNode.members) {
    return;
  }

  const staticMembers = classNode.members.filter(isStaticGetter);
  if (staticMembers.length === 0) {
    return;
  }

  const tagName: string = getStaticValue(staticMembers, 'is');
  if (typeof tagName === 'string' && tagName.includes('-')) {
    parseStaticComponentMeta(config, compilerCtx, buildCtx, moduleFile, typeChecker, tsSourceFile, classNode, staticMembers, tagName);
  }
}


function isStaticGetter(member: ts.ClassElement) {
  return (
    member.kind === ts.SyntaxKind.GetAccessor &&
    member.modifiers && member.modifiers.some(({kind}) => kind === ts.SyntaxKind.StaticKeyword)
  );
}
