import * as d from '@declarations';
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

  cmpMeta.hasAttributeChangedCallbackFn = classMethods.some(m => isMethod(m, 'attributeChangedCallback'));
  cmpMeta.hasConnectedCallbackFn = classMethods.some(m => isMethod(m, 'connectedCallback'));
  cmpMeta.hasDisonnectedCallbackFn = classMethods.some(m => isMethod(m, 'disconnectedCallback'));

  const cmpWillLoadMethod = classMethods.find(m => isMethod(m, 'componentWillLoad')) as ts.MethodDeclaration;
  if (cmpWillLoadMethod) {
    cmpMeta.hasComponentWillLoadFn = true;

    if (isAsyncFn(typeChecker, cmpWillLoadMethod)) {
      cmpMeta.hasAsyncLifecycle = true;
    }
  }

  const cmpWillUpdateMethod = classMethods.find(m => isMethod(m, 'componentWillUpdate')) as ts.MethodDeclaration;
  if (cmpWillUpdateMethod) {
    cmpMeta.hasComponentWillUpdateFn = true;

    if (!cmpMeta.hasAsyncLifecycle && isAsyncFn(typeChecker, cmpWillUpdateMethod)) {
      cmpMeta.hasAsyncLifecycle = true;
    }
  }

  cmpMeta.hasComponentDidLoadFn = classMethods.some(m => isMethod(m, 'componentDidLoad'));
  cmpMeta.hasComponentDidUpdateFn = classMethods.some(m => isMethod(m, 'componentDidUpdate'));
  cmpMeta.hasComponentWillUnloadFn = classMethods.some(m => isMethod(m, 'componentWillUnload'));
  cmpMeta.hasLifecycle = (cmpMeta.hasComponentWillLoadFn || cmpMeta.hasComponentDidLoadFn || cmpMeta.hasComponentWillUpdateFn || cmpMeta.hasComponentDidUpdateFn);

  cmpMeta.hasRenderFn = classMethods.some(m => isMethod(m, 'render'));
  cmpMeta.hasHostDataFn = classMethods.some(m => isMethod(m, 'hostData'));
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
