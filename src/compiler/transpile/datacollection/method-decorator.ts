import * as d from '../../../declarations';
import { getAttributeTypeInfo, isDecoratorNamed, isMethodWithDecorators, serializeSymbol } from './utils';
import { MEMBER_TYPE } from '../../../util/constants';
import { validatePublicName } from './reserved-public-members';
import * as ts from 'typescript';


export function getMethodDecoratorMeta(diagnostics: d.Diagnostic[], checker: ts.TypeChecker, classNode: ts.ClassDeclaration, sourceFile: ts.SourceFile, componentClass: string): d.MembersMeta {
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

      const flags = ts.TypeFormatFlags.WriteArrowStyleSignature;
      const returnType = checker.getReturnTypeOfSignature(methodSignature);
      const typeString = checker.signatureToString(
        methodSignature,
        classNode,
        flags,
        ts.SignatureKind.Call
      );

      let methodReturnTypes: d.AttributeTypeReferences = {};
      const returnTypeNode = checker.typeToTypeNode(returnType);

      if (returnTypeNode) {
        methodReturnTypes = getAttributeTypeInfo(returnTypeNode, sourceFile);
      }

      validatePublicName(diagnostics, componentClass, methodName, '@Method()', 'method');

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
