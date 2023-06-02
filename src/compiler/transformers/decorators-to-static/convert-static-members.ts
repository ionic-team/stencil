import ts from 'typescript';

/**
 * Helper function to detect if a class element fits the following criteria:
 * - It is a property declaration (e.g. `foo`)
 * - It has an initializer (e.g. `foo *=1*`)
 * - The property declaration has the `static` modifier on it (e.g. `*static* foo =1`)
 * @param classElm the class member to test
 * @returns true if the class member fits the above criteria, false otherwise
 */
export const hasStaticInitializerInClass = (classElm: ts.ClassElement): boolean => {
  return (
    ts.isPropertyDeclaration(classElm) &&
    classElm.initializer !== undefined &&
    Array.isArray(classElm.modifiers) &&
    classElm.modifiers!.some((modifier) => modifier.kind === ts.SyntaxKind.StaticKeyword)
  );
};
