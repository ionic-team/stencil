import * as d from '../../../declarations';
import { convertValueToLiteral, createStaticGetter, getAttributeTypeInfo, isDecoratorNamed, isMemberPrivate, serializeSymbol, typeToString } from '../transform-utils';
import { augmentDiagnosticWithNode, buildError, buildWarn } from '@utils';
import { validatePublicName } from '../reserved-public-members';
import ts from 'typescript';


export function methodDecoratorsToStatic(config: d.Config, diagnostics: d.Diagnostic[], sourceFile: ts.SourceFile, decoratedProps: ts.ClassElement[], typeChecker: ts.TypeChecker, newMembers: ts.ClassElement[]) {
  const methods = decoratedProps
    .filter(ts.isMethodDeclaration)
    .map(method => parseMethodDecorator(config, diagnostics, sourceFile, typeChecker, method))
    .filter(method => !!method);

  if (methods.length > 0) {
    newMembers.push(createStaticGetter('methods', ts.createObjectLiteral(methods, true)));
  }
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

  if (!config._isTesting) {
    if (returnString === 'void') {
      const warn = buildWarn(diagnostics);
      warn.header = '@Method requires async';
      warn.messageText = `External @Method() ${methodName}() must return a Promise.\n\n Consider prefixing the method with async, such as @Method async ${methodName}().`;
      augmentDiagnosticWithNode(config, warn, method.name);

      returnString = 'Promise<void>';
      signatureString = signatureString.replace(/=> void$/, '=> Promise<void>');

    } else if (!isTypePromise(returnString)) {
      const err = buildError(diagnostics);
      err.header = '@Method requires async';
      err.messageText = `External @Method() ${methodName}() must return a Promise.\n\n Consider prefixing the method with async, such as @Method async ${methodName}().`;
      augmentDiagnosticWithNode(config, err, method.name);
    }
  }

  if (isMemberPrivate(method)) {
    const err = buildError(diagnostics);
    err.messageText = 'Methods decorated with the @Method() decorator cannot be "private" nor "protected". More info: https://stenciljs.com/docs/methods';
    augmentDiagnosticWithNode(config, err, method.modifiers[0]);
  }

  // Validate if the method name does not conflict with existing public names
  validatePublicName(config, diagnostics, methodName, '@Method()', 'method', method.name);

  const methodMeta: d.ComponentCompilerStaticMethod = {
    complexType: {
      signature: signatureString,
      parameters: signature.parameters.map(symbol => serializeSymbol(typeChecker, symbol)),
      references: {
        ...getAttributeTypeInfo(returnTypeNode, sourceFile),
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
