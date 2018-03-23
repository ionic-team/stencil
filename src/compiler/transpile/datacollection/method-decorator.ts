import { getAttributeTypeInfo, isDecoratorNamed, isMethodWithDecorators, serializeSymbol } from './utils';
import * as d from '../../../declarations';
import { MEMBER_TYPE } from '../../../util/constants';
import * as ts from 'typescript';


export function getMethodDecoratorMeta(config: d.Config, checker: ts.TypeChecker, classNode: ts.ClassDeclaration, sourceFile: ts.SourceFile): d.MembersMeta {
  return classNode.members
    .filter(isMethodWithDecorators)
    .reduce((membersMeta, member: ts.MethodDeclaration) => {
      const methodDecorator = member.decorators.find(isDecoratorNamed('Method'));
      if (methodDecorator == null) {
        return membersMeta;
      }

      const symbol = checker.getSymbolAtLocation(member.name);
      const methodName = member.name.getText();
      const methodSignature = checker.getSignatureFromDeclaration(member);

      const returnType = checker.getReturnTypeOfSignature(methodSignature);
      const typeString = checker.signatureToString(methodSignature, undefined, ts.TypeFormatFlags.WriteArrowStyleSignature, ts.SignatureKind.Call);

      let methodReturnTypes: d.AttributeTypeReferences = {};
      const returnTypeNode = checker.typeToTypeNode(returnType);

      if (returnTypeNode) {
        methodReturnTypes = getAttributeTypeInfo(returnTypeNode, sourceFile);
      }

      validatePublicMethodName(config, methodName);

      membersMeta[methodName] = {
        memberType: MEMBER_TYPE.Method,
        attribType: {
          text: typeString,
          typeReferences: {
            ...methodReturnTypes,
            ...getAttributeTypeInfo(member, sourceFile)
          }
        },
        jsdoc: serializeSymbol(checker, symbol)
      };


      return membersMeta;
    }, {} as d.MembersMeta);
}


function validatePublicMethodName(config: d.Config, methodName: string) {
  if (methodName[0] === 'o' && methodName[1] === 'n' && /[A-Z]/.test(methodName[2])) {
    config.logger.warn([
      `In order to be compatible with all event listeners on elements, it's `,
      `recommended the public method name "${methodName}" does not start with "on". `,
      `Please rename the method so it does not conflict with common event listener naming.`
    ].join(''));
  }
}

