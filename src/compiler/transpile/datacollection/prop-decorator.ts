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
        const type = checker.getTypeAtLocation(prop);
        validatePublicName(diagnostics, componentClass, memberName, '@Prop()', 'property');

        memberData.memberType = getMemberType(propOptions);
        memberData.attribName = getAttributeName(propOptions, memberName);
        memberData.attribType = getAttribType(diagnostics, sourceFile, prop);
        memberData.reflectToAttrib = getReflectToAttr(propOptions);
        memberData.propType = propTypeFromTSType(type, memberData.attribType.text);
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
      catchError(diagnostics, e, `parse prop options: ${e}`);
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
      optional: prop.questionToken !== undefined
    };
  } else {
    attribType = {
      text: prop.type.getText(),
      optional: prop.questionToken !== undefined,
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

function propTypeFromTSType(type: ts.Type, text: string) {
  const isStr = checkType(type, isString);
  const isNu = checkType(type, isNumber);
  const isBool = checkType(type, isBoolean);

  // if type is more than a primitive type at the same time, we mark it as any
  if (Number(isStr) + Number(isNu) + Number(isBool) > 1) {
    return PROP_TYPE.Any;
  }

  // at this point we know the prop's type is NOT the mix of primitive types
  if (isStr) {
    return PROP_TYPE.String;
  }
  if (isNu) {
    return PROP_TYPE.Number;
  }
  if (isBool) {
    return PROP_TYPE.Boolean;
  }
  if (text === 'any') {
    return PROP_TYPE.Any;
  }
  return PROP_TYPE.Unknown;
}

function checkType(type: ts.Type, check: (type: ts.Type) => boolean ): boolean {
  if (type.flags & ts.TypeFlags.Union) {
    const union = type as ts.UnionType;
    if (union.types.some(type => checkType(type, check))) {
      return true;
    }
  }
  return check(type);
}

function isBoolean(t: ts.Type) {
  if (t) {
    return !!(t.flags & (ts.TypeFlags.Boolean | ts.TypeFlags.BooleanLike | ts.TypeFlags.BooleanLike));
  }
  return false;
}

function isNumber(t: ts.Type) {
  if (t) {
    return !!(t.flags & (ts.TypeFlags.Number | ts.TypeFlags.NumberLike | ts.TypeFlags.NumberLiteral));
  }
  return false;
}

function isString(t: ts.Type) {
  if (t) {
    return !!(t.flags & (ts.TypeFlags.String | ts.TypeFlags.StringLike | ts.TypeFlags.StringLiteral));
  }
  return false;
}
