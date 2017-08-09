import { ModuleFile } from '../../../util/interfaces';
import { MEMBER_STATE } from '../../../util/constants';
import * as ts from 'typescript';


export function getStateDecoratorMeta(fileMeta: ModuleFile, classNode: ts.ClassDeclaration) {
  const decoratedMembers = classNode.members.filter(n => n.decorators && n.decorators.length);

  decoratedMembers.forEach(memberNode => {
    let isState = false;
    let propName: string = null;

    memberNode.forEachChild(n => {
      if (n.kind === ts.SyntaxKind.Decorator && n.getChildCount() > 1) {
        const child = n.getChildAt(1);
        const firstToken = child.getFirstToken();

        // If the first token is @State()
        if (firstToken && firstToken.getText() === 'State') {
          isState = true;

        } else if (!firstToken && child.getText() === 'State') {
          // If the first token is @State
          isState = true;
        }
      } else if (isState) {
        if (n.kind === ts.SyntaxKind.Identifier && !propName) {
          propName = n.getText();
        }
      }
    });

    if (isState && propName) {
      fileMeta.cmpMeta.membersMeta[propName] = {
        memberType: MEMBER_STATE
      };
      memberNode.decorators = undefined;
    }
  });
}
