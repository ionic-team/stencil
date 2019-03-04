import * as d from '@declarations';
import { convertValueToLiteral, createStaticGetter, getAttributeTypeInfo, isDecoratorNamed, serializeSymbol, typeToString } from '../transform-utils';
import ts from 'typescript';
import { buildError, normalizePath, buildWarn } from '@utils';
import { sys } from '@sys';
import { validatePublicName } from '../reserved-public-members';

export function methodDecoratorsToStatic(config: d.Config, diagnostics: d.Diagnostic[], sourceFile: ts.SourceFile, decoratedProps: ts.ClassElement[], typeChecker: ts.TypeChecker, newMembers: ts.ClassElement[]) {
  const methods = decoratedProps
    .filter(ts.isMethodDeclaration)
    .map(method => parseMethodDecorator(config, diagnostics, sourceFile, typeChecker, method))
    .filter(method => !!method);

  if (methods.length > 0) {
    newMembers.push(createStaticGetter('methods', ts.createObjectLiteral(methods, true)));
  }
  sourceFile.statements.some(st => ts.isClassDeclaration(st) && st.name.text === 'Hola');
}


function parseMethodDecorator(config: d.Config, diagnostics: d.Diagnostic[], sourceFile: ts.SourceFile, typeChecker: ts.TypeChecker, method: ts.MethodDeclaration) {
  const methodDecorator = method.decorators.find(isDecoratorNamed('Method'));
  if (methodDecorator == null) {
    return null;
  }

  const methodName = method.name.getText();
  const flags = ts.TypeFormatFlags.WriteArrowStyleSignature | ts.TypeFormatFlags.NoTruncation;
  const signature = typeChecker.getSignatureFromDeclaration(method);
  const returnType = typeChecker.getReturnTypeOfSignature(signature);
  const returnTypeNode = typeChecker.typeToTypeNode(returnType);
  let returnString = typeToString(typeChecker, returnType);
  let signatureString = typeChecker.signatureToString(
    signature,
    method,
    flags,
    ts.SignatureKind.Call
  );

  if (returnString === 'void') {
    const warn = buildWarn(diagnostics);
    warn.header = '@Method requires async';
    warn.messageText = `External @Method() ${methodName}() must return a Promise.\n\n Consider prefixing the method with async, such as @Method async ${methodName}().`;
    warn.absFilePath = normalizePath(sourceFile.fileName);
    warn.relFilePath = normalizePath(sys.path.relative(config.rootDir, sourceFile.fileName));

    returnString = 'Promise<void>';
    signatureString.replace(/=> void$/, '=> Promise<void>');

  } else if (!isTypePromise(returnString)) {
    const err = buildError(diagnostics);
    err.header = '@Method requires async';
    err.messageText = `External @Method() ${methodName}() must return a Promise.\n\n Consider prefixing the method with async, such as @Method async ${methodName}().`;
    err.absFilePath = normalizePath(sourceFile.fileName);
    err.relFilePath = normalizePath(sys.path.relative(config.rootDir, sourceFile.fileName));
    return null;
  }

  // Validate if the method name does not conflict with existing public names
  validatePublicName(config, diagnostics, sourceFile, methodName, '@Method()', 'method');

  const methodReturnTypes = (returnTypeNode)
    ? getAttributeTypeInfo(returnTypeNode, sourceFile)
    : {};

  const methodMeta: d.ComponentCompilerStaticMethod = {
    complexType: {
      signature: signatureString,
      parameters: signature.parameters.map(symbol => serializeSymbol(typeChecker, symbol)),
      references: {
        ...methodReturnTypes,
        ...getAttributeTypeInfo(method, sourceFile)
      },
      return: returnString
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

function isTypePromise(typeStr: string) {
  return /^Promise<.+>$/.test(typeStr);
}
