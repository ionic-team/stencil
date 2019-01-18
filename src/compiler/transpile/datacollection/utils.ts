import * as d from '@declarations';
import ts from 'typescript';


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

export function serializeSymbol(checker: ts.TypeChecker, symbol: ts.Symbol): d.JsDoc {
  return {
    name: symbol.getName(),
    tags: symbol.getJsDocTags(),
    documentation: ts.displayPartsToString(symbol.getDocumentationComment(checker)),
    type: serializeDocsSymbol(checker, symbol)
  };
}

export function serializeDocsSymbol(checker: ts.TypeChecker, symbol: ts.Symbol): string {
  const type = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
  const set = new Set<string>();
  parseDocsType(checker, type, set);

  // normalize booleans
  const hasTrue = set.delete('true');
  const hasFalse = set.delete('false');
  if (hasTrue || hasFalse) {
    set.add('boolean');
  }

  let parts = Array.from(set.keys()).sort();
  if (parts.length > 1) {
    parts = parts.map(p => (p.indexOf('=>') >= 0) ? `(${p})` : p);
  }
  if (parts.length > 20) {
    return typeToString(checker, type);
  } else {
    return parts.join(' | ');
  }
}

const TYPE_FORMAT_FLAGS =
  ts.TypeFormatFlags.NoTruncation |
  ts.TypeFormatFlags.InTypeAlias |
  ts.TypeFormatFlags.InElementType;

export function typeToString(checker: ts.TypeChecker, type: ts.Type) {
  return checker.typeToString(type, undefined, TYPE_FORMAT_FLAGS);
}

export function parseDocsType(checker: ts.TypeChecker, type: ts.Type, parts: Set<string>) {
  const text = typeToString(checker, type);
  if (type.isUnion()) {
    (type as ts.UnionType).types.forEach(t => {
      parseDocsType(checker, t, parts);
    });
  } else {
    parts.add(text);
  }
}

export function isMethod(member: ts.ClassElement, methodName: string) {
  if (ts.isMethodDeclaration(member)) {
    return member.getFirstToken().getText() === methodName;
  }
  return false;
}

export function getAttributeTypeInfo(baseNode: ts.Node, sourceFile: ts.SourceFile) {
  return getAllTypeReferences(baseNode)
    .reduce((allReferences, rt)  => {
      allReferences[rt] = getTypeReferenceLocation(rt, sourceFile);
      return allReferences;
    }, {} as d.AttributeTypeReferences);
}

function getAllTypeReferences(node: ts.Node): string[] {
  const referencedTypes: string[] = [];

  function visit(node: ts.Node): ts.VisitResult<ts.Node> {
    switch (node.kind) {
    case ts.SyntaxKind.TypeReference:
      const typeNode = node as ts.TypeReferenceNode;

      if (ts.isIdentifier(typeNode.typeName)) {
        const name = typeNode.typeName as ts.Identifier;
        referencedTypes.push(name.escapedText.toString());
      }
      if (typeNode.typeArguments) {
        typeNode.typeArguments
          .filter(ta => ts.isTypeReferenceNode(ta))
          .forEach((tr: ts.TypeReferenceNode) => {
            const name = tr.typeName as ts.Identifier;
            referencedTypes.push(name.escapedText.toString());
          });
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

function getTypeReferenceLocation(typeName: string, sourceFile: ts.SourceFile): d.AttributeTypeReference {
  const sourceFileObj = sourceFile.getSourceFile();

  // Loop through all top level imports to find any reference to the type for 'import' reference location
  const importTypeDeclaration = sourceFileObj.statements.find(st => {
    const statement = ts.isImportDeclaration(st) &&
      st.importClause &&
      ts.isImportClause(st.importClause) &&
      st.importClause.namedBindings &&
      ts.isNamedImports(st.importClause.namedBindings) &&
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

    const isTypeAliasDeclarationExported = ((ts.isTypeAliasDeclaration(st) &&
      (<ts.Identifier>st.name).getText() === typeName) &&
      Array.isArray(st.modifiers) &&
      st.modifiers.some(mod => mod.kind === ts.SyntaxKind.ExportKeyword));

    // Is the interface exported through a named export
    const isTypeInExportDeclaration = ts.isExportDeclaration(st) &&
      ts.isNamedExports(st.exportClause) &&
      st.exportClause.elements.some(nee => nee.name.getText() === typeName);

    return isInterfaceDeclarationExported || isTypeAliasDeclarationExported || isTypeInExportDeclaration;
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
