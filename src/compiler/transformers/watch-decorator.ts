import { FileMeta } from '../interfaces';
import * as ts from 'typescript';


export function getWatchDecoratorMeta(fileMeta: FileMeta, classNode: ts.ClassDeclaration) {
  fileMeta.cmpMeta.watchers = [];

  const propMembers = classNode.members.filter(n => n.decorators && n.decorators.length);

  propMembers.forEach(memberNode => {
    let isWatch = false;
    let propName: string = null;
    let methodName: string = null;

    memberNode.forEachChild(n => {

      if (n.kind === ts.SyntaxKind.Decorator && n.getChildCount() > 1 && n.getChildAt(1).getFirstToken().getText() === 'Watch') {
        isWatch = true;

        n.getChildAt(1).forEachChild(n => {

          if (n.kind === ts.SyntaxKind.StringLiteral && !propName) {
            propName = n.getText();
            propName = propName.replace(/\'/g, '');
            propName = propName.replace(/\"/g, '');
            propName = propName.replace(/\`/g, '');
          }

        });

      } else if (isWatch) {
        if (n.kind === ts.SyntaxKind.Identifier && !methodName) {
          methodName = n.getText();
        }
      }

    });

    if (isWatch && propName && methodName) {
      fileMeta.cmpMeta.watchers.push({
        propName: propName,
        fn: methodName
      });

      memberNode.decorators = undefined;
    }
  });
}
