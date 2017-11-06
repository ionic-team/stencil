import { catchError } from '../../util';
import { Diagnostic, MemberMeta, MembersMeta, PropOptions } from '../../../util/interfaces';
import { MEMBER_TYPE, PROP_TYPE } from '../../../util/constants';
import * as ts from 'typescript';


export function getPropDecoratorMeta(tsFilePath: string, diagnostics: Diagnostic[], classNode: ts.ClassDeclaration) {
  const membersMeta: MembersMeta = {};
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

        // If the first token is @Prop()
        if (firstToken && firstToken.getText() === 'Prop') {
          isProp = true;

        } else if (!firstToken && child.getText() === 'Prop') {
          // If the first token is @Prop
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
              d.absFilePath = tsFilePath;
            }
          }
        });

      } else if (isProp) {
        if (n.kind === ts.SyntaxKind.Identifier && !propName) {
          propName = n.getText();

        } else if (!propType) {
          if (n.kind === ts.SyntaxKind.BooleanKeyword || n.kind === ts.SyntaxKind.TrueKeyword || n.kind === ts.SyntaxKind.FalseKeyword) {
            // @Prop() myBoolean: boolean;
            // @Prop() myBoolean = true;
            // @Prop() myBoolean = false;
            propType = PROP_TYPE.Boolean;
            shouldObserveAttribute = true;

          } else if (n.kind === ts.SyntaxKind.NumberKeyword || n.kind === ts.SyntaxKind.NumericLiteral) {
            // @Prop() myNumber: number;
            // @Prop() myNumber = 88;
            propType = PROP_TYPE.Number;
            shouldObserveAttribute = true;

          } else if (n.kind === ts.SyntaxKind.StringKeyword || n.kind === ts.SyntaxKind.StringLiteral) {
            // @Prop() myString: string;
            // @Prop() myString = 'some string';
            propType = PROP_TYPE.String;
            shouldObserveAttribute = true;

          } else if (n.kind === ts.SyntaxKind.AnyKeyword) {
            // @Prop() myAny: any;
            propType = PROP_TYPE.Any;
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

      const propMeta: MemberMeta = membersMeta[propName] = {
        memberType: MEMBER_TYPE.Prop
      };

      if (propType) {
        propMeta.propType = propType;
      }

      if (userPropOptions) {
        if (typeof userPropOptions.connect === 'string') {
          propMeta.memberType = MEMBER_TYPE.PropConnect;
          propMeta.ctrlId = userPropOptions.connect;
        }

        if (typeof userPropOptions.context === 'string') {
          propMeta.memberType = MEMBER_TYPE.PropContext;
          propMeta.ctrlId = userPropOptions.context;
        }

        if (typeof userPropOptions.state === 'boolean') {
          diagnostics.push({
            level: 'warn',
            type: 'build',
            header: '@Prop({ state: true }) option has been deprecated',
            messageText: `"state" has been renamed to @Prop({ mutable: true }) ${tsFilePath}`,
            absFilePath: tsFilePath
          });
          userPropOptions.mutable = userPropOptions.state;
        }

        if (typeof userPropOptions.mutable === 'boolean') {
          propMeta.memberType = MEMBER_TYPE.PropMutable;
        }
      }

      if (shouldObserveAttribute) {
        propMeta.attribName = propName;
      }

      // Remove decorator
      memberNode.decorators = undefined;
    }
  });

  return membersMeta;
}


const EXCLUDE_PROP_NAMES = ['mode', 'color'];
