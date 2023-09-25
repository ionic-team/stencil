// At this point, all meta-to-static conversions should have occurred
// for all class definitions (whether they are component definitions or not).
//
// The goal here is to recursively (bottom-to-top) "merge" any extended classes
// back into their respective component definition classes (those decorated by `@Component()`).
// This way, when the static-to-meta process runs, we can continue to only execute that on
// component classes.

import ts from 'typescript';

import { getStaticValue, isStaticGetter } from './transform-utils';

export const mergeInheritedClasses = (typeChecker: ts.TypeChecker): ts.TransformerFactory<ts.SourceFile> => {
  return (transformCtx) => {
    const visit = (node: ts.Node): ts.VisitResult<ts.Node> => {
      if (
        ts.isClassDeclaration(node) &&
        getStaticValue(Array.from(node.members.filter(isStaticGetter)), 'is') != null &&
        node.heritageClauses?.find((ref) => ref.token === ts.SyntaxKind.ExtendsKeyword)
      ) {
        return visitClassDeclaration(node, typeChecker);
      }
      return ts.visitEachChild(node, visit, transformCtx);
    };

    return (tsSourceFile) => {
      return ts.visitEachChild(tsSourceFile, visit, transformCtx);
    };
  };
};

const visitClassDeclaration = (node: ts.ClassDeclaration, typeChecker: ts.TypeChecker): ts.ClassDeclaration => {
  // Need to get to last class in heritage chain and "merge" up the tree
  const baseClass = typeChecker.getSymbolAtLocation(node.heritageClauses[0].types[0].expression);
  const tmp = (baseClass.declarations[0].parent.parent as ts.ImportDeclaration).moduleSpecifier;
  if (baseClass != null) {
    return visitClassDeclaration(baseClass.valueDeclaration as any, typeChecker);
  }

  return node;
};
