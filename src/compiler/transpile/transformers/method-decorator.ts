import { MembersMeta } from '../../../util/interfaces';
import { MEMBER_METHOD } from '../../../util/constants';
import * as ts from 'typescript';


export function getMethodDecoratorMeta(classNode: ts.ClassDeclaration) {
  const membersMeta: MembersMeta = {};
  const decoratedMembers = classNode.members.filter(n => n.decorators && n.decorators.length);
  const methodMembers = decoratedMembers.filter(n => n.kind === ts.SyntaxKind.MethodDeclaration);

  methodMembers.forEach(methodNode => {
    let isMethod = false;
    let methodName: string = null;
    methodNode.forEachChild(n => {
      if (n.kind === ts.SyntaxKind.Decorator && n.getChildCount() > 1 && n.getChildAt(1).getFirstToken().getText() === 'Method') {
        isMethod = true;

      } else if (isMethod) {
        if (n.kind === ts.SyntaxKind.Identifier && !methodName) {
          methodName = n.getText();
        }
      }
    });

    if (isMethod && methodName) {
      membersMeta[methodName] = {
        memberType: MEMBER_METHOD
      };

      // Remove decorator
      methodNode.decorators = undefined;
    }
  });

  return membersMeta;
}
