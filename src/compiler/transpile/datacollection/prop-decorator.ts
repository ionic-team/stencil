import { AttributeTypeInfo, Diagnostic, MemberMeta, MembersMeta, PropOptions } from '../../../declarations';
import { catchError } from '../../util';
import { getAttributeTypeInfo, isDecoratorNamed, serializeSymbol } from './utils';
import { toDashCase } from '../../../util/helpers';
import { MEMBER_TYPE, PROP_TYPE } from '../../../util/constants';
import * as ts from 'typescript';


export function getPropDecoratorMeta(checker: ts.TypeChecker, classNode: ts.ClassDeclaration, sourceFile: ts.SourceFile, diagnostics: Diagnostic[]): MembersMeta {
  return classNode.members
    .filter(member => Array.isArray(member.decorators) && member.decorators.length > 0)
    .reduce((allMembers: MembersMeta, prop: ts.PropertyDeclaration) => {
      const memberData: MemberMeta = {};
      const propDecorator = prop.decorators.find(isDecoratorNamed('Prop'));
      if (propDecorator == null) {
        return allMembers;
      }

      const suppliedOptions = (<ts.CallExpression>propDecorator.expression).arguments
        .map(arg => {
          try {
            const fnStr = `return ${arg.getText()};`;
            return new Function(fnStr)();

          } catch (e) {
            const d = catchError(diagnostics, e);
            d.messageText = `parse prop options: ${e}`;
          }
        });
      const propOptions: PropOptions = suppliedOptions[0];
      const memberName = (<ts.Identifier>prop.name).text;
      const symbol = checker.getSymbolAtLocation(prop.name);

      if (propOptions && typeof propOptions.connect === 'string') {
        memberData.memberType = MEMBER_TYPE.PropConnect;
        memberData.ctrlId = propOptions.connect;

      } else if (propOptions && typeof propOptions.context === 'string') {
        memberData.memberType = MEMBER_TYPE.PropContext;
        memberData.ctrlId = propOptions.context;

      } else {
        let attribType: AttributeTypeInfo;

        // If the @Prop() attribute does not have a defined type then infer it
        if (!prop.type) {
          let attribTypeText = inferPropType(prop.initializer);

          if (!attribTypeText) {
            attribTypeText = 'any';
            diagnostics.push({
              level: 'warn',
              type: 'build',
              header: 'Prop type provided is not supported, defaulting to any',
              messageText: `'${prop.getFullText()}'`,
            });
          }
          attribType = {
            text: attribTypeText,
          };
        } else {
          attribType = getAttributeTypeInfo(prop.type, sourceFile);
        }

        if (propOptions && typeof propOptions.state === 'boolean') {
          diagnostics.push({
            level: 'warn',
            type: 'build',
            header: '@Prop({ state: true }) option has been deprecated',
            messageText: `"state" has been renamed to @Prop({ mutable: true })`,
          });
          propOptions.mutable = propOptions.state;
        }

        if (propOptions && typeof propOptions.mutable === 'boolean') {
          memberData.memberType = MEMBER_TYPE.PropMutable;
        } else {
          memberData.memberType = MEMBER_TYPE.Prop;
        }

        memberData.attribName = toDashCase(memberName);
        memberData.attribType = attribType;
        memberData.propType = propTypeFromTSType(attribType.text);
        memberData.jsdoc = serializeSymbol(checker, symbol);
      }

      allMembers[memberName] = memberData;
      return allMembers;
    }, {} as MembersMeta);
}


function inferPropType(expression: ts.Expression | undefined) {
  if (expression == null) {
    return undefined;
  }
  if (ts.isStringLiteral(expression)) {
    return 'string';
  }
  if (ts.isNumericLiteral(expression)) {
    return 'number';
  }
  if ([ ts.SyntaxKind.BooleanKeyword, ts.SyntaxKind.TrueKeyword, ts.SyntaxKind.FalseKeyword ].indexOf(expression.kind) !== -1) {
    return 'boolean';
  }
  if ((ts.SyntaxKind.NullKeyword === expression.kind) ||
      (ts.SyntaxKind.UndefinedKeyword === expression.kind) ||
      (ts.isRegularExpressionLiteral(expression)) ||
      (ts.isArrayLiteralExpression(expression)) ||
      (ts.isObjectLiteralExpression(expression))) {
    return 'any';
  }
  return undefined;
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
      return PROP_TYPE.Any;
    default:
      return PROP_TYPE.Unknown;
  }
}
