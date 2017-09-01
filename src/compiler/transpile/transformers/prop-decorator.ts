import { catchError } from '../../util';
import { Diagnostic, ModuleFile, MemberMeta, PropOptions } from '../../../util/interfaces';
import { MEMBER_PROP, MEMBER_PROP_MUTABLE, MEMBER_PROP_CONNECT,
  MEMBER_PROP_CONTEXT, TYPE_NUMBER, TYPE_BOOLEAN } from '../../../util/constants';
import * as ts from 'typescript';


export function getPropDecoratorMeta(moduleFile: ModuleFile, diagnostics: Diagnostic[], classNode: ts.ClassDeclaration) {
  const decoratedMembers = classNode.members.filter(n => n.decorators && n.decorators.length);

  decoratedMembers.forEach(memberNode => {
    let isProp = false;
    let propName: string = null;
    let propType: number = null;
    let userPropOptions: PropOptions = null;
    let shouldObserveAttribute = false;

    memberNode.forEachChild(n => {
      if (n.kind === ts.SyntaxKind.Decorator && n.getChildCount() > 1) {
        const child = n.getChildAt(1);
        const firstToken = child.getFirstToken();

        // If the first token is @State()
        if (firstToken && firstToken.getText() === 'Prop') {
          isProp = true;

        } else if (!firstToken && child.getText() === 'Prop') {
          // If the first token is @State
          isProp = true;
        }

        if (!isProp) return;

        n.getChildAt(1).forEachChild(n => {
          if (n.kind === ts.SyntaxKind.ObjectLiteralExpression) {
            try {
              const fnStr = `return ${n.getText()};`;
              userPropOptions = Object.assign(userPropOptions || {}, new Function(fnStr)());

            } catch (e) {
              const d = catchError(diagnostics, e);
              d.messageText = `parse prop options: ${e}`;
              d.absFilePath = moduleFile.tsFilePath;
            }
          }
        });

      } else if (isProp) {
        if (n.kind === ts.SyntaxKind.Identifier && !propName) {
          propName = n.getText();

        } else if (!propType) {
          if (n.kind === ts.SyntaxKind.BooleanKeyword) {
            // @Prop() myBoolean: boolean;
            propType = TYPE_BOOLEAN;
            shouldObserveAttribute = true;

          } else if (n.kind === ts.SyntaxKind.NumberKeyword) {
            // @Prop() myNumber: number;
            propType = TYPE_NUMBER;
            shouldObserveAttribute = true;

          } else if (n.kind === ts.SyntaxKind.StringKeyword) {
            // @Prop() myString: string;
            shouldObserveAttribute = true;

          } else if (n.kind === ts.SyntaxKind.AnyKeyword) {
            // @Prop() myAny: any;
            shouldObserveAttribute = true;
          }
        }

      }

    });

    if (isProp && propName) {
      if (EXCLUDE_PROP_NAMES.indexOf(propName) > -1) {
        // these automatically get added at runtime, so don't bother here
        memberNode.decorators = undefined;
        return;
      }

      const propMeta: MemberMeta = moduleFile.cmpMeta.membersMeta[propName] = {
        memberType: MEMBER_PROP
      };

      if (propType) {
        propMeta.propType = propType;
      }

      if (userPropOptions) {
        if (typeof userPropOptions.connect === 'string') {
          propMeta.memberType = MEMBER_PROP_CONNECT;
          propMeta.ctrlId = userPropOptions.connect;
        }

        if (typeof userPropOptions.context === 'string') {
          propMeta.memberType = MEMBER_PROP_CONTEXT;
          propMeta.ctrlId = userPropOptions.context;
        }

        if (typeof userPropOptions.state === 'boolean') {
          diagnostics.push({
            level: 'warn',
            type: 'build',
            header: '@Prop({ state: true }) option has been deprecated',
            messageText: `"state" has been renamed to @Prop({ mutable: true }) ${moduleFile.tsFilePath}`,
            absFilePath: moduleFile.tsFilePath
          });
          userPropOptions.mutable = userPropOptions.state;
        }

        if (typeof userPropOptions.mutable === 'boolean') {
          propMeta.memberType = MEMBER_PROP_MUTABLE;
        }
      }

      if (shouldObserveAttribute) {
        propMeta.attribName = propName;
      }

      memberNode.decorators = undefined;
    }
  });
}


const EXCLUDE_PROP_NAMES = ['mode', 'color'];
