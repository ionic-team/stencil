import { catchError } from '../../util';
import { Diagnostic, MemberMeta, MembersMeta, PropOptions } from '../../../util/interfaces';
import { MEMBER_TYPE, PROP_TYPE } from '../../../util/constants';
import * as ts from 'typescript';


export function getPropDecoratorMeta(tsFilePath: string, diagnostics: Diagnostic[], classNode: ts.ClassDeclaration): MembersMeta {
  const decoratedMembers = classNode.members.filter(n => n.decorators && n.decorators.length);

  return decoratedMembers
    .filter((prop: ts.PropertyDeclaration) => (
      prop.decorators.some((decorator: ts.Decorator) => decorator.getFullText().indexOf('Prop(') !== -1) &&
      (EXCLUDE_PROP_NAMES.indexOf((<ts.Identifier>prop.name).text) === -1)
    ))
    .reduce((allMembers: MembersMeta, prop: ts.PropertyDeclaration) => {
      const memberData: MemberMeta = {};

      const propDecorator = prop.decorators.find((decorator: ts.Decorator) => (
        decorator.getFullText().indexOf('Prop(') !== -1)
      );
      const suppliedOptions = (<ts.CallExpression>propDecorator.expression).arguments
        .map(arg => {
          try {
            const fnStr = `return ${arg.getText()};`;
            return new Function(fnStr)();

          } catch (e) {
            const d = catchError(diagnostics, e);
            d.messageText = `parse prop options: ${e}`;
            d.absFilePath = tsFilePath;
          }
        });
      const propOptions: PropOptions = suppliedOptions[0];
      const attribName = (<ts.Identifier>prop.name).text;

      if (propOptions) {
        if (typeof propOptions.connect === 'string') {
          memberData.memberType = MEMBER_TYPE.PropConnect;
          memberData.ctrlId = propOptions.connect;
        }

        if (typeof propOptions.context === 'string') {
          memberData.memberType = MEMBER_TYPE.PropContext;
          memberData.ctrlId = propOptions.context;
        }

        if (typeof propOptions.state === 'boolean') {
          diagnostics.push({
            level: 'warn',
            type: 'build',
            header: '@Prop({ state: true }) option has been deprecated',
            messageText: `"state" has been renamed to @Prop({ mutable: true }) ${tsFilePath}`,
            absFilePath: tsFilePath
          });
          propOptions.mutable = propOptions.state;
        }

        if (typeof propOptions.mutable === 'boolean') {
          memberData.memberType = MEMBER_TYPE.PropMutable;
        }
      } else {
        memberData.memberType = MEMBER_TYPE.Prop;
        memberData.attribName = attribName;

        if (!prop.type) {
          memberData.attribType = inferPropType(prop.initializer);
        } else {
          memberData.attribType = prop.type.getFullText().trim();
        }
        memberData['propType'] = propTypeFromTSType(memberData.attribType);
      }

      allMembers[attribName] = memberData;

      return allMembers;
    }, {} as MembersMeta);
}


const EXCLUDE_PROP_NAMES = ['mode', 'color'];

function inferPropType(expression: ts.Expression) {
  if (ts.isStringLiteral(expression)) {
    return 'string';
  }
  if (ts.isNumericLiteral(expression)) {
    return 'number';
  }
  if ([ ts.SyntaxKind.BooleanKeyword, ts.SyntaxKind.TrueKeyword, ts.SyntaxKind.FalseKeyword ].indexOf(expression.kind) !== -1) {
    return 'boolean';
  }

  return 'any';
}

function propTypeFromTSType(type: string) {
  switch (type) {
  case 'string':
    return PROP_TYPE.String;
  case 'number':
    return PROP_TYPE.Number;
  case 'boolean':
    return PROP_TYPE.Boolean;
  case 'any':
  default:
    return PROP_TYPE.Any;
  }
}
