import { FileMeta } from '../interfaces';
import * as ts from 'typescript';


export function getPropertyDecoratorMeta(fileMeta: FileMeta, classNode: ts.ClassDeclaration) {
  fileMeta.cmpMeta.props = {};

  const decoratedMembers = classNode.members.filter(n => n.decorators && n.decorators.length);

  decoratedMembers.forEach(memberNode => {
    let isProp = false;
    let propName: string = null;
    let type: string = null;

    memberNode.forEachChild(n => {

      if (n.kind === ts.SyntaxKind.Decorator && n.getChildCount() > 1 && n.getChildAt(1).getFirstToken().getText() === 'Prop') {
        isProp = true;

      } else if (isProp) {
        if (n.kind === ts.SyntaxKind.Identifier && !propName) {
          propName = n.getText();

        } else if (!type) {
          if (n.kind === ts.SyntaxKind.BooleanKeyword) {
            type = 'boolean';

          } else if (n.kind === ts.SyntaxKind.StringKeyword) {
            type = 'string';

          } else if (n.kind === ts.SyntaxKind.NumberKeyword) {
            type = 'number';

          } else if (n.kind === ts.SyntaxKind.TypeReference) {
            type = 'Type';
          }
        }
      }

    });

    if (isProp && propName) {
      fileMeta.cmpMeta.props[propName] = {};

      if (type) {
        fileMeta.cmpMeta.props[propName].type = type;
      }

      memberNode.decorators = undefined;
    }
  });
}
