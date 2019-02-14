import * as d from '@declarations';
import { convertValueToLiteral, createStaticGetter, isDecoratorNamed, serializeSymbol, typeToString, getAttributeTypeInfo } from '../transform-utils';
import ts from 'typescript';


export function methodDecoratorsToStatic(diagnostics: d.Diagnostic[], sourceFile: ts.SourceFile, decoratedProps: ts.ClassElement[], typeChecker: ts.TypeChecker, newMembers: ts.ClassElement[]) {
  const methods = decoratedProps
    .filter(ts.isMethodDeclaration)
    .map(method => parseMethodDecorator(diagnostics, sourceFile, typeChecker, method))
    .filter(method => !!method);

  if (methods.length > 0) {
    newMembers.push(createStaticGetter('methods', ts.createObjectLiteral(methods, true)));
  }
}


function parseMethodDecorator(_diagnostics: d.Diagnostic[], sourceFile: ts.SourceFile, typeChecker: ts.TypeChecker, method: ts.MethodDeclaration) {
  const methodDecorator = method.decorators.find(isDecoratorNamed('Method'));
  if (methodDecorator == null) {
    return null;
  }

  const methodName = method.name.getText();
  const flags = ts.TypeFormatFlags.WriteArrowStyleSignature | ts.TypeFormatFlags.NoTruncation;
  const signature = typeChecker.getSignatureFromDeclaration(method);
  const returnType = typeChecker.getReturnTypeOfSignature(signature);
  const returnTypeNode = typeChecker.typeToTypeNode(returnType);
  const typeString = typeChecker.signatureToString(
    signature,
    method,
    flags,
    ts.SignatureKind.Call
  );

  const methodReturnTypes = (returnTypeNode)
    ? getAttributeTypeInfo(returnTypeNode, sourceFile)
    : {};

  const methodMeta: d.ComponentCompilerStaticMethod = {
    complexType: {
      signature: typeString,
      parameters: signature.parameters.map(symbol => serializeSymbol(typeChecker, symbol)),
      references: {
        ...methodReturnTypes,
        ...getAttributeTypeInfo(method, sourceFile)
      },
      return: typeToString(typeChecker, returnType)
    },
    docs: {
      text: ts.displayPartsToString(signature.getDocumentationComment(typeChecker)),
      tags: signature.getJsDocTags()
    }
  };

  const staticProp = ts.createPropertyAssignment(
    ts.createLiteral(methodName),
    convertValueToLiteral(methodMeta)
  );

  return staticProp;
}
