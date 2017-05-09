import { FileMeta } from '../interfaces';
import * as ts from 'typescript';


export function getMethodDecoratorMeta(fileMeta: FileMeta, classNode: ts.ClassDeclaration) {
  fileMeta.cmpMeta.methods = [];

  const decoratedMembers = classNode.members.filter(n => n.decorators && n.decorators.length);
  const methodMemebers = decoratedMembers.filter(n => n.kind === ts.SyntaxKind.MethodDeclaration);

  methodMemebers.forEach(methodNode => {
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
      fileMeta.cmpMeta.methods.push(methodName);
      methodNode.decorators = undefined;
    }
  });

  fileMeta.cmpMeta.methods = fileMeta.cmpMeta.methods.sort();
}
