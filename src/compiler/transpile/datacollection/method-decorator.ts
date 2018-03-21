import { getAttributeTypeInfo, isDecoratorNamed, isMethodWithDecorators, serializeSymbol } from './utils';
import { MembersMeta } from '../../../declarations';
import { MEMBER_TYPE } from '../../../util/constants';
import * as ts from 'typescript';


export function getMethodDecoratorMeta(checker: ts.TypeChecker, classNode: ts.ClassDeclaration, sourceFile: ts.SourceFile): MembersMeta {
  return classNode.members
    .filter(isMethodWithDecorators)
    .reduce((membersMeta, member: ts.MethodDeclaration) => {
      const methodDecorator = member.decorators.find(isDecoratorNamed('Method'));
      if (methodDecorator == null) {
        return membersMeta;
      }

      const symbol = checker.getSymbolAtLocation(member.name);
      const sig = checker.getSignatureFromDeclaration(member);

      const typeString = checker.signatureToString(sig, undefined, ts.TypeFormatFlags.WriteArrowStyleSignature, ts.SignatureKind.Call);

      membersMeta[member.name.getText()] = {
        memberType: MEMBER_TYPE.Method,
        attribType: {
          text: typeString,
          typeReferences: getAttributeTypeInfo(member, sourceFile)
        },
        jsdoc: serializeSymbol(checker, symbol)
      };


      return membersMeta;
    }, {} as MembersMeta);
}

