import { FileMeta, PropMeta, PropOptions } from '../interfaces';
import { TYPE_NUMBER, TYPE_BOOLEAN } from '../../util/constants';
import * as ts from 'typescript';


export function getPropertyDecoratorMeta(fileMeta: FileMeta, classNode: ts.ClassDeclaration) {
  fileMeta.cmpMeta.propsMeta = [];

  const decoratedMembers = classNode.members.filter(n => n.decorators && n.decorators.length);

  decoratedMembers.forEach(memberNode => {
    let isProp = false;
    let propName: string = null;
    let propType: number = null;
    let userPropOptions: PropOptions = null;

    memberNode.forEachChild(n => {

      if (n.kind === ts.SyntaxKind.Decorator && n.getChildCount() > 1) {
        const child = n.getChildAt(1);
        const firstToken = child.getFirstToken()

        // If the first token is @State()
        if (firstToken && firstToken.getText() === 'Prop') {
          isProp = true;
        }
        // If the first token is @State
        else if(!firstToken && child.getText() == 'Prop') {
          isProp = true;
        }

        n.getChildAt(1).forEachChild(n => {
          if (n.kind === ts.SyntaxKind.ObjectLiteralExpression) {
            try {
              const fnStr = `return ${n.getText()};`;

              userPropOptions = Object.assign(userPropOptions || {}, new Function(fnStr)());

            } catch (e) {
              console.log(`parse prop options: ${e}`);
            }
          }
        });

      } else if (isProp) {
        if (n.kind === ts.SyntaxKind.Identifier && !propName) {
          propName = n.getText();

        } else if (!propType) {
          if (n.kind === ts.SyntaxKind.BooleanKeyword) {
            propType = TYPE_BOOLEAN;

          } else if (n.kind === ts.SyntaxKind.NumberKeyword) {
            propType = TYPE_NUMBER;
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

      if (userPropOptions) {
        if (typeof userPropOptions.type === 'string') {
          userPropOptions.type = userPropOptions.type.toLowerCase().trim();

          if (userPropOptions.type === 'boolean') {
            prop.propType = TYPE_BOOLEAN;

          } else if (userPropOptions.type === 'number') {
            prop.propType = TYPE_NUMBER;
          }
        }

        if (typeof userPropOptions.twoWay === 'boolean') {
          prop.isTwoWay = !!userPropOptions.twoWay;
        }
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
