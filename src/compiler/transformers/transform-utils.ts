import ts from 'typescript';
import * as d from '@declarations';

export function objectToObjectLiteral(obj: { [key: string]: any }): ts.ObjectLiteralExpression {
  const newProperties: ts.ObjectLiteralElementLike[] = Object.keys(obj).map(key => {
    const prop = ts.createPropertyAssignment(ts.createLiteral(key), convertValueToLiteral(obj[key]) as ts.Expression);
    return prop;
  });
  return ts.createObjectLiteral(newProperties, true);
}


export function convertValueToLiteral(val: any) {
  if (val === String) {
    return ts.createIdentifier('String');
  }
  if (val === Number) {
    return ts.createIdentifier('Number');
  }
  if (val === Boolean) {
    return ts.createIdentifier('Boolean');
  }
  if (val === undefined) {
    return ts.createIdentifier('undefined');
  }
  if (val === null) {
    return ts.createIdentifier('null');
  }
  if (Array.isArray(val)) {
    return arrayToArrayLiteral(val);
  }
  if (typeof val === 'object') {
    return objectToObjectLiteral(val);
  }
  return ts.createLiteral(val);
}


function arrayToArrayLiteral(list: any[]): ts.ArrayLiteralExpression {
  const newList: any[] = list.map(convertValueToLiteral);
  return ts.createArrayLiteral(newList);
}


export function isDecoratorNamed(name: string) {
  return (dec: ts.Decorator): boolean => {
    return (ts.isCallExpression(dec.expression) && dec.expression.expression.getText() === name);
  };
}


export function createStaticGetter(name: string, returnExpression: ts.Expression) {
  return ts.createGetAccessor(
    undefined,
    [ts.createToken(ts.SyntaxKind.StaticKeyword)],
    name,
    undefined,
    undefined,
    ts.createBlock([
      ts.createReturn(returnExpression)
    ])
  );
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


export function evalText(text: string) {
  const fnStr = `return ${text};`;
  return new Function(fnStr)();
}


export function removeDecorator(node: ts.Node, decoratorName: string) {
  if (node.decorators) {
    const updatedDecoratorList = node.decorators.filter(dec => {
      const toRemove = ts.isCallExpression(dec.expression) &&
        ts.isIdentifier(dec.expression.expression) &&
        dec.expression.expression.text === decoratorName;
      return !toRemove;
    });

    if (updatedDecoratorList.length !== node.decorators.length) {
      node.decorators = ts.createNodeArray(updatedDecoratorList);
      if (node.decorators.length === 0) {
        node.decorators = undefined;
      }
    }
  }
}


export function getStaticValue(staticMembers: ts.ClassElement[], staticName: string): any {
  const staticMember: ts.GetAccessorDeclaration = staticMembers.find(member => (member.name as any).escapedText === staticName) as any;
  if (!staticMember || !staticMember.body || !staticMember.body.statements) {
    return null;
  }

  const rtnStatement: ts.ReturnStatement = staticMember.body.statements.find(s => s.kind === ts.SyntaxKind.ReturnStatement) as any;
  if (!rtnStatement || !rtnStatement.expression) {
    return null;
  }

  if (rtnStatement.expression.kind === ts.SyntaxKind.StringLiteral) {
    return (rtnStatement.expression as ts.StringLiteral).text;
  }

  if (rtnStatement.expression.kind === ts.SyntaxKind.TrueKeyword) {
    return true;
  }

  if (rtnStatement.expression.kind === ts.SyntaxKind.FalseKeyword) {
    return false;
  }

  if (rtnStatement.expression.kind === ts.SyntaxKind.ObjectLiteralExpression) {
    return objectLiteralToObjectMap(rtnStatement.expression as any);
  }

  if (rtnStatement.expression.kind === ts.SyntaxKind.ArrayLiteralExpression && (rtnStatement.expression as ts.ArrayLiteralExpression).elements) {
    return arrayLiteralToArray(rtnStatement.expression as any);
  }

  return null;
}


export function arrayLiteralToArray(arr: ts.ArrayLiteralExpression) {
  return arr.elements.map(element => {
    let val: any;

    switch (element.kind) {
      case ts.SyntaxKind.ObjectLiteralExpression:
        val = objectLiteralToObjectMap(element as ts.ObjectLiteralExpression);
        break;

      case ts.SyntaxKind.StringLiteral:
        val = (element as ts.StringLiteral).text;
        break;

      case ts.SyntaxKind.TrueKeyword:
        val = true;
        break;

      case ts.SyntaxKind.FalseKeyword:
        val = false;
        break;

      case ts.SyntaxKind.Identifier:
        const escapedText = (element as ts.Identifier).escapedText;
        if (escapedText === 'String') {
          val = String;
        } else if (escapedText === 'Number') {
          val = Number;
        } else if (escapedText === 'Boolean') {
          val = Boolean;
        }
        break;

      case ts.SyntaxKind.PropertyAccessExpression:
      default:
        val = element;
    }

    return val;
  });
}


export function objectLiteralToObjectMap(objectLiteral: ts.ObjectLiteralExpression): ObjectMap {
  const attrs: ts.ObjectLiteralElementLike[] = (objectLiteral.properties as any);

  return attrs.reduce((final: ObjectMap, attr: ts.PropertyAssignment) => {
    const name = getTextOfPropertyName(attr.name);
    let val: any;

    switch (attr.initializer.kind) {
      case ts.SyntaxKind.ObjectLiteralExpression:
        val = objectLiteralToObjectMap(attr.initializer as ts.ObjectLiteralExpression);
        break;

      case ts.SyntaxKind.StringLiteral:
        val = (attr.initializer as ts.StringLiteral).text;
        break;

      case ts.SyntaxKind.TrueKeyword:
        val = true;
        break;

      case ts.SyntaxKind.FalseKeyword:
        val = false;
        break;

      case ts.SyntaxKind.Identifier:
        const escapedText = (attr.initializer as ts.Identifier).escapedText;
        if (escapedText === 'String') {
          val = String;
        } else if (escapedText === 'Number') {
          val = Number;
        } else if (escapedText === 'Boolean') {
          val = Boolean;
        }
        break;

      case ts.SyntaxKind.PropertyAccessExpression:
      default:
        val = attr.initializer;
    }

    final[name] = val;
    return final;

  }, <ObjectMap>{});
}

function getTextOfPropertyName(name: ts.PropertyName): string {
  switch (name.kind) {
  case ts.SyntaxKind.Identifier:
    return (<ts.Identifier>name).text;
  case ts.SyntaxKind.StringLiteral:
  case ts.SyntaxKind.NumericLiteral:
    return (<ts.LiteralExpression>name).text;
  case ts.SyntaxKind.ComputedPropertyName:
    const expression = (<ts.ComputedPropertyName>name).expression;
    if (ts.isStringLiteral(expression) || ts.isNumericLiteral(expression)) {
      return (<ts.LiteralExpression>(<ts.ComputedPropertyName>name).expression).text;
    }
  }
  return undefined;
}

export class ObjectMap {
  [key: string]: ts.Expression | ObjectMap
}

export function getAttributeTypeInfo(baseNode: ts.Node, sourceFile: ts.SourceFile) {
  return getAllTypeReferences(baseNode)
    .reduce((allReferences, rt)  => {
      allReferences[rt] = getTypeReferenceLocation(rt, sourceFile);
      return allReferences;
    }, {} as d.ComponentCompilerTypeReferences);
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

function getTypeReferenceLocation(typeName: string, sourceFile: ts.SourceFile): d.ComponentCompilerTypeReference {
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
      location: 'import',
      path: localImportPath
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
      location: 'local'
    };
  }

  // This is most likely a global type, if it is a local that is not exported then typescript will inform the dev
  return {
    location: 'global',
  };
}

export function resolveType(checker: ts.TypeChecker, type: ts.Type): string {
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
  ts.TypeFormatFlags.InElementType | ts.TypeFormatFlags.WriteArrayAsGenericType;

export function typeToString(checker: ts.TypeChecker, type: ts.Type) {
  return checker.typeToString(type, undefined, TYPE_FORMAT_FLAGS);
}

export function parseDocsType(checker: ts.TypeChecker, type: ts.Type, parts: Set<string>) {
  if (type.isUnion()) {
    (type as ts.UnionType).types.forEach(t => {
      parseDocsType(checker, t, parts);
    });
  } else {
    const text = typeToString(checker, type);
    parts.add(text);
  }
}

export function getLeadingComments(node: ts.Node, sourceFile: ts.SourceFile) {
  if (node.parent) {
    const nodePos = node.pos;
    const parentPos = node.parent.pos;

    if (node.parent.kind === ts.SyntaxKind.SourceFile || nodePos !== parentPos) {
      const comments = ts.getLeadingCommentRanges(sourceFile.text, nodePos);
      if (Array.isArray(comments)) {
        return comments.map((comment) => {
          return sourceFile.text.substring(comment.pos, comment.end);
        });
      }
    }
  }
  return undefined;
}

export function copyComments(src: ts.Node, dst: ts.Node) {
  const comments = getLeadingComments(src, src.getSourceFile());
  if (comments) {
    const newComments = comments.map(text => ({
      hasTrailingNewLine: false,
      kind: ts.SyntaxKind.MultiLineCommentTrivia,
      text: text,
      pos: -1,
      end: -1,
    }));
    ts.setSyntheticLeadingComments(dst, newComments as any);
  }
}


export function isComponentClassNode(node: ts.Node, cmp: d.ComponentCompilerMeta): node is ts.ClassDeclaration {
  if (ts.isClassDeclaration(node)) {
    if (cmp.componentClassName === node.name.getText().trim()) {
      return true;
    }
  }
  return false;
}


export function createImportDeclaration(importPath: string, importFnName: string) {
  return ts.createImportDeclaration(
    undefined,
    undefined,
    ts.createImportClause(undefined, ts.createNamedImports([
      ts.createImportSpecifier(undefined, ts.createIdentifier(importFnName))
    ])),
    ts.createLiteral(importPath)
  );
}


export function addVariable(varName: string, expression: ts.Expression) {
  const left = ts.createUniqueName(varName);
  return ts.createBinary(left, ts.SyntaxKind.EqualsToken, expression);
}


export function addImportDeclaration(tsSourceFile: ts.SourceFile, importPath: string, importFnName: string) {
  return ts.updateSourceFileNode(tsSourceFile, [
    createImportDeclaration(importPath, importFnName),
    ...tsSourceFile.statements
  ]);
}
