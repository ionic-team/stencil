import { MembersMeta } from '../../../util/interfaces';
import { MEMBER_TYPE } from '../../../util/constants';
import * as ts from 'typescript';


export function getElementDecoratorMeta(classNode: ts.ClassDeclaration) {
  const membersMeta: MembersMeta = {};
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
      membersMeta[hostElementMember] = {
        memberType: MEMBER_TYPE.Element
      };

      // Remove decorator
      memberNode.decorators = undefined;
    }
  });

  return membersMeta;
}
