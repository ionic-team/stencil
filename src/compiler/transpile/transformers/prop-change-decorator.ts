import { PropChangeMeta } from '../../../util/interfaces';
import { PROP_CHANGE } from '../../../util/constants';
import * as ts from 'typescript';


export function getPropChangeDecoratorMeta(classNode: ts.ClassDeclaration) {

  return {
    propsWillChangeMeta: getPropChangeDecorator(classNode, 'PropWillChange'),
    propsDidChangeMeta: getPropChangeDecorator(classNode, 'PropDidChange')
  };
}


function getPropChangeDecorator(classNode: ts.ClassDeclaration, decoratorName: string): PropChangeMeta[] {
  const decoratedMembers = classNode.members.filter(n => n.decorators && n.decorators.length);
  const propChangeMeta: PropChangeMeta[] = [];

  decoratedMembers.forEach(memberNode => {
    let isPropChange = false;
    let propName: string = null;
    let methodName: string = null;

    memberNode.forEachChild(n => {

      if (n.kind === ts.SyntaxKind.Decorator &&
          n.getChildCount() > 1 &&
          n.getChildAt(1).getFirstToken() &&
          n.getChildAt(1).getFirstToken().getText() === decoratorName) {

        isPropChange = true;

        n.getChildAt(1).forEachChild(n => {

          if (n.kind === ts.SyntaxKind.StringLiteral && !propName) {
            propName = n.getText();
            propName = propName.replace(/\'/g, '');
            propName = propName.replace(/\"/g, '');
            propName = propName.replace(/\`/g, '');
          }

        });

      } else if (isPropChange) {
        if (n.kind === ts.SyntaxKind.Identifier && !methodName) {
          methodName = n.getText();
        }
      }

    });

    if (isPropChange && propName && methodName) {
      const propChange: any = [];

      propChange[PROP_CHANGE.PropName] = propName;
      propChange[PROP_CHANGE.MethodName] = methodName;

      propChangeMeta.push(propChange);

      memberNode.decorators = undefined;
    }
  });

  return propChangeMeta.sort((a, b) => {
    if (a[PROP_CHANGE.PropName].toLowerCase() < b[PROP_CHANGE.PropName].toLowerCase()) return -1;
    if (a[PROP_CHANGE.PropName].toLowerCase() > b[PROP_CHANGE.PropName].toLowerCase()) return 1;
    if (a[PROP_CHANGE.MethodName] < b[PROP_CHANGE.MethodName]) return -1;
    if (a[PROP_CHANGE.MethodName] > b[PROP_CHANGE.MethodName]) return 1;
    return 0;
  });
}
