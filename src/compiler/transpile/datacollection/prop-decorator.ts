import * as d from '../../../declarations';
import { catchError } from '../../util';
import { getAttributeTypeInfo, isDecoratorNamed, serializeSymbol } from './utils';
import { toDashCase } from '../../../util/helpers';
import { MEMBER_TYPE, PROP_TYPE } from '../../../util/constants';
import * as ts from 'typescript';


export function getPropDecoratorMeta(config: d.Config, checker: ts.TypeChecker, classNode: ts.ClassDeclaration, sourceFile: ts.SourceFile, diagnostics: d.Diagnostic[]) {
  return classNode.members
    .filter(member => Array.isArray(member.decorators) && member.decorators.length > 0)
    .reduce((allMembers: d.MembersMeta, prop: ts.PropertyDeclaration) => {
      const memberData: d.MemberMeta = {};
      const propDecorator = prop.decorators.find(isDecoratorNamed('Prop'));

      if (propDecorator == null) {
        return allMembers;
      }

      const propOptions = getPropOptions(propDecorator, diagnostics);
      const memberName = (prop.name as ts.Identifier).text;
      const symbol = checker.getSymbolAtLocation(prop.name);

      if (propOptions && typeof propOptions.connect === 'string') {
        // @Prop({ connect: 'ion-alert-controller' })
        memberData.memberType = MEMBER_TYPE.PropConnect;
        memberData.ctrlId = propOptions.connect;

      } else if (propOptions && typeof propOptions.context === 'string') {
        // @Prop({ context: 'config' })
        memberData.memberType = MEMBER_TYPE.PropContext;
        memberData.ctrlId = propOptions.context;

      } else {
        // @Prop()
        validatePublicPropName(config, memberName);

        memberData.memberType = getMemberType(propOptions);
        memberData.attribName = getAttributeName(propOptions, memberName);
        memberData.attribType = getAttribType(sourceFile, prop, diagnostics);
        memberData.reflectToAttr = getReflectToAttr(propOptions);
        memberData.propType = propTypeFromTSType(memberData.attribType.text);
        memberData.jsdoc = serializeSymbol(checker, symbol);
      }

      allMembers[memberName] = memberData;
      return allMembers;
    }, {} as d.MembersMeta);
}


function validatePublicPropName(config: d.Config, memberName: string) {
  if (memberName[0] === 'o' && memberName[1] === 'n' && /[A-Z]/.test(memberName[2])) {
    config.logger.warn([
      `In order to be compatible with all event listeners on elements, it's `,
      `recommended the public property name "${memberName}" does not start with "on", `,
      `followed by capital letter which is the third character. `,
      `Please rename the property so it does not conflict with common event listener naming.`
    ].join(''));
  }
}


function getPropOptions(propDecorator: ts.Decorator, diagnostics: d.Diagnostic[]) {
  const suppliedOptions = (propDecorator.expression as ts.CallExpression).arguments
  .map(arg => {
    try {
      const fnStr = `return ${arg.getText()};`;
      return new Function(fnStr)();

    } catch (e) {
      const d = catchError(diagnostics, e);
      d.messageText = `parse prop options: ${e}`;
    }
  });

  const propOptions: d.PropOptions = suppliedOptions[0];
  return propOptions;
}


function getMemberType(propOptions: d.PropOptions) {
  if (propOptions && propOptions.mutable === true) {
    return MEMBER_TYPE.PropMutable;
  }

  return MEMBER_TYPE.Prop;
}


function getAttributeName(propOptions: d.PropOptions, memberName: string) {
  if (propOptions && typeof propOptions.attr === 'string' && propOptions.attr.trim().length > 0) {
    return propOptions.attr.trim();
  }
  return toDashCase(memberName);
}


function getReflectToAttr(propOptions: d.PropOptions) {
  if (propOptions && propOptions.reflectToAttr === true) {
    return true;
  }

  return false;
}


function getAttribType(sourceFile: ts.SourceFile, prop: ts.PropertyDeclaration, diagnostics: d.Diagnostic[]) {
  let attribType: d.AttributeTypeInfo;

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

  return attribType;
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
