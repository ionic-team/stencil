import { AttributeTypeInfo, AttributeTypeReference, JSDoc } from '../../../declarations';
import * as ts from 'typescript';


export function evalText(text: string) {
  const fnStr = `return ${text};`;
  return new Function(fnStr)();
}

export interface GetDeclarationParameters {
  <T>(decorator: ts.Decorator): [T];
  <T, T1>(decorator: ts.Decorator): [T, T1];
  <T, T1, T2>(decorator: ts.Decorator): [T, T1, T2];
}
export const getDeclarationParameters: GetDeclarationParameters = (decorator: ts.Decorator): any => {
  if (!ts.isCallExpression(decorator.expression)) {
    return [];
  }

  return decorator.expression.arguments.map((arg) => {
    return evalText(arg.getText().trim());
  });
};

export function isDecoratorNamed(name: string) {
  return (dec: ts.Decorator): boolean => {
    return (ts.isCallExpression(dec.expression) && dec.expression.expression.getText() === name);
  };
}

export function isPropertyWithDecorators(member: ts.ClassElement): boolean {
  return ts.isPropertyDeclaration(member)
    && Array.isArray(member.decorators)
    && member.decorators.length > 0;
}

export function isMethodWithDecorators(member: ts.ClassElement): boolean {
  return ts.isMethodDeclaration(member)
    && Array.isArray(member.decorators)
    && member.decorators.length > 0;
}

export function serializeSymbol(checker: ts.TypeChecker, symbol: ts.Symbol): JSDoc {
  return {
      name: symbol.getName(),
      documentation: ts.displayPartsToString(symbol.getDocumentationComment(checker)),
      type: checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration))
  };
}

export function isMethod(member: ts.ClassElement, methodName: string): boolean {
  if (ts.isMethodDeclaration(member)) {
    return member.getFirstToken().getText() === methodName;
  }
  return false;
}

export function getAttributeTypeInfo(type: ts.TypeNode, sourceFile: ts.SourceFile): AttributeTypeInfo {
  const typeInfo: AttributeTypeInfo = {
    text: type.getFullText().trim()
  };
  const typeReferences = getAllTypeReferences(type)
    .reduce((allReferences, rt)  => {
      allReferences[rt] = getTypeReferenceLocation(rt, sourceFile);
      return allReferences;
    }, {} as { [key: string]: AttributeTypeReference});

  if (Object.keys(typeReferences).length > 0) {
    typeInfo.typeReferences = typeReferences;
  }
  return typeInfo;
}

function getAllTypeReferences(node: ts.TypeNode): string[] {
  const referencedTypes: string[] = [];

  function visit(node: ts.Node): ts.VisitResult<ts.Node> {
    switch (node.kind) {
    case ts.SyntaxKind.TypeReference:
      referencedTypes.push((<ts.TypeReferenceNode>node).typeName.getText().trim());
      if ((<ts.TypeReferenceNode>node).typeArguments) {
        (<ts.TypeReferenceNode>node).typeArguments
          .filter(ta => ts.isTypeReferenceNode(ta))
          .forEach(tr => referencedTypes.push((<ts.TypeReferenceNode>tr).typeName.getText().trim()));
      }
    /* tslint:disable */
    default:
      return ts.forEachChild(node, (node) => {
        return visit(node);
      });
    }
    /* tslint:enable */
  }

  visit(node);

  return referencedTypes;
}

function getTypeReferenceLocation(typeName: string, sourceFile: ts.SourceFile): AttributeTypeReference {

  const sourceFileObj = sourceFile.getSourceFile();

  // Loop through all top level imports to find any reference to the type for 'import' reference location
  const importTypeDeclaration = sourceFileObj.statements.find(st => {
    const statement = ts.isImportDeclaration(st) &&
      ts.isImportClause(st.importClause) &&
      st.importClause.namedBindings &&  ts.isNamedImports(st.importClause.namedBindings) &&
      Array.isArray(st.importClause.namedBindings.elements) &&
      st.importClause.namedBindings.elements.find(nbe => nbe.name.getText() === typeName);
    if (!statement) {
      return false;
    }
    return true;
  });

  if (importTypeDeclaration) {
    const localImportPath = (<ts.StringLiteral>(<ts.ImportDeclaration>importTypeDeclaration).moduleSpecifier).text;
    return {
      referenceLocation: 'import',
      importReferenceLocation: localImportPath
    };
  }

  // Loop through all top level exports to find if any reference to the type for 'local' reference location
  const isExported = sourceFileObj.statements.some(st => {
    // Is the interface defined in the file and exported
    const isInterfaceDeclarationExported = ((ts.isInterfaceDeclaration(st) &&
      (<ts.Identifier>st.name).getText() === typeName) &&
      Array.isArray(st.modifiers) &&
      st.modifiers.some(mod => mod.kind === ts.SyntaxKind.ExportKeyword));

    // Is the interface exported through a named export
    const isTypeInExportDeclaration = ts.isExportDeclaration(st) &&
      ts.isNamedExports(st.exportClause) &&
      st.exportClause.elements.some(nee => nee.name.getText() === typeName);

    return isInterfaceDeclarationExported || isTypeInExportDeclaration;
  });

  if (isExported) {
    return {
      referenceLocation: 'local'
    };
  }


  // This is most likely a global type, if it is a local that is not exported then typescript will inform the dev
  return {
    referenceLocation: 'global',
  };
}
