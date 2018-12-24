import * as d from '../../../declarations';
import { getModuleFile } from '../../build/compiler-ctx';
import { getStaticValue } from '../transform-utils';
import { parseStaticComponentMeta } from './component';
import ts from 'typescript';


export function gatherMeta(config: d.Config, compilerCtx: d.CompilerCtx, diagnostics: d.Diagnostic[], typeChecker: ts.TypeChecker): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext) => {

    function visit(moduleFile: d.ModuleFile, tsSourceFile: ts.SourceFile, node: ts.Node): ts.VisitResult<ts.Node> {
      if (ts.isClassDeclaration(node)) {
        visitClass(config, compilerCtx, diagnostics, moduleFile, typeChecker, tsSourceFile, node as ts.ClassDeclaration);
      }

      return ts.visitEachChild(node, node => {
        return visit(moduleFile, tsSourceFile, node);
      }, transformContext);
    }

    return tsSourceFile => {
      const moduleFile = getModuleFile(compilerCtx, tsSourceFile.fileName);
      return visit(moduleFile, tsSourceFile, tsSourceFile) as ts.SourceFile;
    };
  };
}


function visitClass(config: d.Config, compilerCtx: d.CompilerCtx, diagnostics: d.Diagnostic[], moduleFile: d.ModuleFile, typeChecker: ts.TypeChecker, tsSourceFile: ts.SourceFile, classNode: ts.ClassDeclaration) {
  if (!classNode.members) {
    return;
  }

  const staticMembers = classNode.members.filter(isStaticGetter);
  if (staticMembers.length === 0) {
    return;
  }

  const tagName: string = getStaticValue(staticMembers, 'is');
  if (typeof tagName === 'string' && tagName.includes('-')) {
    parseStaticComponentMeta(config, compilerCtx, diagnostics, moduleFile, typeChecker, tsSourceFile, classNode, staticMembers, tagName);
  }
}

function isStaticGetter(member: ts.ClassElement) {
  return (
    member.kind === ts.SyntaxKind.GetAccessor &&
    member.modifiers && member.modifiers.some(({kind}) => kind === ts.SyntaxKind.StaticKeyword)
  );
}
