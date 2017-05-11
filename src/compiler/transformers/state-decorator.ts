import { FileMeta } from '../interfaces';
import * as ts from 'typescript';


export function getStateDecoratorMeta(fileMeta: FileMeta, classNode: ts.ClassDeclaration) {
  fileMeta.cmpMeta.states = [];

  const decoratedMembers = classNode.members.filter(n => n.decorators && n.decorators.length);

  decoratedMembers.forEach(memberNode => {
    let isState = false;
    let propName: string = null;

    memberNode.forEachChild(n => {
      if (n.kind === ts.SyntaxKind.Decorator && n.getChildCount() > 1 && n.getChildAt(1).getFirstToken().getText() === 'State') {
        isState = true;

      } else if (isState) {
        if (n.kind === ts.SyntaxKind.Identifier && !propName) {
          propName = n.getText();
        }
      }
    });

    if (isState && propName) {
      fileMeta.cmpMeta.states.push(propName);
      memberNode.decorators = undefined;
    }
  });

  fileMeta.cmpMeta.states = fileMeta.cmpMeta.states.sort();
}
