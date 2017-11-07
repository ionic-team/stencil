import { catchError } from '../../util';
import { Diagnostic, MemberMeta, MembersMeta, PropOptions } from '../../../util/interfaces';
import { MEMBER_TYPE, PROP_TYPE } from '../../../util/constants';
import * as ts from 'typescript';


export function getPropDecoratorMeta(tsFilePath: string, diagnostics: Diagnostic[], classNode: ts.ClassDeclaration, sourceFile: ts.SourceFile): MembersMeta {
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
        let attribTypeText;
        let typeError: Diagnostic = undefined;

        if (!prop.type) {
          attribTypeText = inferPropType(prop.initializer);
          if (!attribTypeText) {
            typeError = {
              level: 'warn',
              type: 'build',
              header: 'Prop type provided is not supported defaulting to any',
              messageText: `'${prop.getFullText()}' from ${tsFilePath}`,
              absFilePath: tsFilePath
            };
          }
        } else {
          typeError = checkType(prop.type, sourceFile, tsFilePath);
          attribTypeText = prop.type.getFullText().trim();
        }

        if (typeError) {
          diagnostics.push(typeError);
          attribTypeText = 'any';
        }
        memberData.attribType = {
          text: attribTypeText,
          isReferencedType: !!(!typeError && prop.type && ts.isTypeReferenceNode(prop.type))
        };
        memberData.attribName = attribName;
        memberData.propType = propTypeFromTSType(attribTypeText);
      }

      allMembers[attribName] = memberData;

      prop.decorators = undefined;
      return allMembers;
    }, {} as MembersMeta);
}


const EXCLUDE_PROP_NAMES = ['mode', 'color'];

function checkType(type: ts.TypeNode, sourceFile: ts.SourceFile, tsFilePath: string): Diagnostic | undefined {
  if (ts.isTypeReferenceNode(type)) {
    let typeName = type.typeName.getText();

    const isExported = sourceFile.statements.some(st => {
      let isInterfaceDeclaration = ((ts.isInterfaceDeclaration(st) &&
        (<ts.Identifier>st.name).getText() === typeName) &&
        Array.isArray(st.modifiers) &&
        st.modifiers.some(mod => mod.kind === ts.SyntaxKind.ExportKeyword));

      let isExportDeclaration = ts.isNamedExports(st) &&
        (<ts.NamedExports>st).elements.some(nee => nee.name.getText() === typeName);

      return isInterfaceDeclaration || isExportDeclaration;
    });
    if (!isExported) {
      return {
        level: 'warn',
        type: 'build',
        header: 'Prop has referenced interface that is not exported defaulting to any',
        messageText: `Interface '${typeName}' must be exported from ${tsFilePath}`,
        absFilePath: tsFilePath
      } as Diagnostic;
    }
  }

  return undefined;
}

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
  default:
    return PROP_TYPE.Any;
  }
}
