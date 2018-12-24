import * as d from '../../../declarations';
import ts from 'typescript';


export function parseClassMethods(typeChecker: ts.TypeChecker, cmpNode: ts.ClassDeclaration, cmpMeta: d.ComponentCompilerMeta) {
  const classMembers = cmpNode.members;
  if (!classMembers || classMembers.length === 0) {
    return;
  }

  const classMethods = classMembers.filter(m => ts.isMethodDeclaration(m));
  if (classMethods.length === 0) {
    return;
  }
  const features = cmpMeta.features;

  features.hasAttributeChangedCallbackFn = classMethods.some(m => isMethod(m, 'attributeChangedCallback'));
  features.hasConnectedCallbackFn = classMethods.some(m => isMethod(m, 'connectedCallback'));
  features.hasDisonnectedCallbackFn = classMethods.some(m => isMethod(m, 'disconnectedCallback'));

  const cmpWillLoadMethod = classMethods.find(m => isMethod(m, 'componentWillLoad')) as ts.MethodDeclaration;
  if (cmpWillLoadMethod) {
    features.hasComponentWillLoadFn = true;

    if (isAsyncFn(typeChecker, cmpWillLoadMethod)) {
      features.hasAsyncLifecycle = true;
    }
  }

  const cmpWillUpdateMethod = classMethods.find(m => isMethod(m, 'componentWillUpdate')) as ts.MethodDeclaration;
  if (cmpWillUpdateMethod) {
    features.hasComponentWillUpdateFn = true;

    if (!features.hasAsyncLifecycle && isAsyncFn(typeChecker, cmpWillUpdateMethod)) {
      features.hasAsyncLifecycle = true;
    }
  }

  features.hasComponentDidLoadFn = classMethods.some(m => isMethod(m, 'componentDidLoad'));
  features.hasComponentDidUpdateFn = classMethods.some(m => isMethod(m, 'componentDidUpdate'));
  features.hasComponentWillUnloadFn = classMethods.some(m => isMethod(m, 'componentWillUnload'));
  features.hasLifecycle = (features.hasComponentWillLoadFn || features.hasComponentDidLoadFn || features.hasComponentWillUpdateFn || features.hasComponentDidUpdateFn);

  features.hasRenderFn = classMethods.some(m => isMethod(m, 'render'));
  features.hasHostDataFn = classMethods.some(m => isMethod(m, 'hostData'));
}


function isMethod(member: ts.ClassElement, methodName: string) {
  return member.name && (member.name as any).escapedText === methodName;
}


function isAsyncFn(typeChecker: ts.TypeChecker, methodDeclaration: ts.MethodDeclaration) {
  if (methodDeclaration.modifiers) {
    if (methodDeclaration.modifiers.some(m => m.kind === ts.SyntaxKind.AsyncKeyword)) {
      return true;
    }
  }

  const methodSignature = typeChecker.getSignatureFromDeclaration(methodDeclaration);
  const returnType = typeChecker.getReturnTypeOfSignature(methodSignature);
  const typeStr = typeChecker.typeToString(returnType, undefined, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.InTypeAlias | ts.TypeFormatFlags.InElementType);

  return typeStr.includes('Promise');
}
