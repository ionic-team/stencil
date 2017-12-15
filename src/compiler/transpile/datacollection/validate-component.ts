import { BuildConfig, ComponentMeta } from '../../../util/interfaces';
import { isMethod } from './utils';
import * as ts from 'typescript';


export function validateComponentClass(config: BuildConfig, cmpMeta: ComponentMeta, classNode: ts.ClassDeclaration) {
  requiresReturnStatement(config, cmpMeta, classNode, 'hostData');
  requiresReturnStatement(config, cmpMeta, classNode, 'render');
}


function requiresReturnStatement(config: BuildConfig, cmpMeta: ComponentMeta, classNode: ts.ClassDeclaration, methodName: string) {
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
    config.logger.warn(`The "${methodName}()" method within the "${cmpMeta.tagNameMeta}" component is missing a "return" statement.`);
  }
}
