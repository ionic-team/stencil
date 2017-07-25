import { ModuleFile } from '../../../util/interfaces';
import * as ts from 'typescript';


export function getElementDecoratorMeta(fileMeta: ModuleFile, classNode: ts.ClassDeclaration) {
  fileMeta.cmpMeta.hostElementMember = null;

  const decoratedMembers = classNode.members.filter(n => n.decorators && n.decorators.length);

  decoratedMembers.forEach(memberNode => {
    let isElement = false;
    let hostElementMember: string = null;

    memberNode.forEachChild(n => {
      if (n.kind === ts.SyntaxKind.Decorator && n.getChildCount() > 1) {
        const child = n.getChildAt(1);
        const firstToken = child.getFirstToken();

        // If the first token is @Element()
        if (firstToken && firstToken.getText() === 'Element') {
          isElement = true;

        } else if (!firstToken && child.getText() === 'Element') {
          // If the first token is @Element
          isElement = true;
        }
      } else if (isElement) {
        if (n.kind === ts.SyntaxKind.Identifier && !hostElementMember) {
          hostElementMember = n.getText();
        }
      }
    });

    if (isElement && hostElementMember) {
      fileMeta.cmpMeta.hostElementMember = hostElementMember;
      memberNode.decorators = undefined;
    }
  });
}
