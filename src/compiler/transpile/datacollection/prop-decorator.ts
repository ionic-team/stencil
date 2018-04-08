import * as d from '../../../declarations';
import { buildWarn, catchError } from '../../util';
import { getAttributeTypeInfo, isDecoratorNamed, serializeSymbol } from './utils';
import { MEMBER_TYPE, PROP_TYPE } from '../../../util/constants';
import { toDashCase } from '../../../util/helpers';
import { validatePublicName } from './reserved-public-members';
import * as ts from 'typescript';


export function getPropDecoratorMeta(diagnostics: d.Diagnostic[], checker: ts.TypeChecker, classNode: ts.ClassDeclaration, sourceFile: ts.SourceFile, componentClass: string) {
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
        validatePublicName(diagnostics, componentClass, memberName, '@Prop()', 'property');

        memberData.memberType = getMemberType(propOptions);
        memberData.attribName = getAttributeName(propOptions, memberName);
        memberData.attribType = getAttribType(diagnostics, sourceFile, prop);
        memberData.reflectToAttr = getReflectToAttr(propOptions);
        memberData.propType = propTypeFromTSType(memberData.attribType.text);
        memberData.jsdoc = serializeSymbol(checker, symbol);
      }

      allMembers[memberName] = memberData;
      return allMembers;
    }, {} as d.MembersMeta);
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


function getAttribType(diagnostics: d.Diagnostic[], sourceFile: ts.SourceFile, prop: ts.PropertyDeclaration) {
  let attribType: d.AttributeTypeInfo;

  // If the @Prop() attribute does not have a defined type then infer it
  if (!prop.type) {
    let attribTypeText = inferPropType(prop.initializer);

    if (!attribTypeText) {
      attribTypeText = 'any';

      const diagnostic = buildWarn(diagnostics);
      diagnostic.messageText = `Prop type provided is not supported, defaulting to any: '${prop.getFullText()}'`;
    }

    attribType = {
      text: attribTypeText,
    };

  } else {
    attribType = {
      text: prop.type.getText(),
      typeReferences: getAttributeTypeInfo(prop.type, sourceFile)
    };
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
