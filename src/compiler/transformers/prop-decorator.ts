import { FileMeta, PropMeta } from '../interfaces';
import * as ts from 'typescript';


export function getPropertyDecoratorMeta(fileMeta: FileMeta, classNode: ts.ClassDeclaration) {
  fileMeta.cmpMeta.propsMeta = [];

  const decoratedMembers = classNode.members.filter(n => n.decorators && n.decorators.length);

  decoratedMembers.forEach(memberNode => {
    let isProp = false;
    let propName: string = null;
    let propType: string = null;

    memberNode.forEachChild(n => {

      if (n.kind === ts.SyntaxKind.Decorator && n.getChildCount() > 1 && n.getChildAt(1).getFirstToken().getText() === 'Prop') {
        isProp = true;

      } else if (isProp) {
        if (n.kind === ts.SyntaxKind.Identifier && !propName) {
          propName = n.getText();

        } else if (!propType) {
          if (n.kind === ts.SyntaxKind.BooleanKeyword) {
            propType = 'boolean';

          } else if (n.kind === ts.SyntaxKind.StringKeyword) {
            propType = 'string';

          } else if (n.kind === ts.SyntaxKind.NumberKeyword) {
            propType = 'number';

          } else if (n.kind === ts.SyntaxKind.TypeReference) {
            propType = 'Type';
          }
        }
      }

    });

    if (isProp && propName) {
      const prop: PropMeta = {
        propName: propName
      };

      if (propType) {
        prop.propType = propType;
      }

      fileMeta.cmpMeta.propsMeta.push(prop);

      memberNode.decorators = undefined;
    }
  });

  fileMeta.cmpMeta.propsMeta = fileMeta.cmpMeta.propsMeta.sort((a, b) => {
    if (a.propName < b.propName) return -1;
    if (a.propName > b.propName) return 1;
    return 0;
  });
}
