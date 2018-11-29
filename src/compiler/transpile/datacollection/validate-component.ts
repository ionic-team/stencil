import * as d from '../../../declarations';
import { buildWarn } from '../../util';
import { isMethod } from './utils';
import ts from 'typescript';


export function validateComponentClass(diagnostics: d.Diagnostic[], cmpMeta: d.ComponentMeta, classNode: ts.ClassDeclaration) {
  requiresReturnStatement(diagnostics, cmpMeta, classNode, 'hostData');
  requiresReturnStatement(diagnostics, cmpMeta, classNode, 'render');
}


function requiresReturnStatement(diagnostics: d.Diagnostic[], cmpMeta: d.ComponentMeta, classNode: ts.ClassDeclaration, methodName: string) {
  const classElm = classNode.members.find(m => isMethod(m, methodName));
  if (!classElm) return;

  let hasReturn = false;

  function visitNode(node: ts.Node): any {
    if (node.kind === ts.SyntaxKind.ReturnStatement) {
      hasReturn = true;
    }
    ts.forEachChild(node, visitNode);
  }

  ts.forEachChild(classElm, visitNode);

  if (!hasReturn) {
    const diagnostic = buildWarn(diagnostics);
    diagnostic.messageText = `The "${methodName}()" method within the "${cmpMeta.tagNameMeta}" component is missing a "return" statement.`;
  }
}
