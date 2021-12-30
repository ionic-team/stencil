import type * as d from '../../declarations';
import { augmentDiagnosticWithNode, buildError, normalizePath } from '@utils';
import { MEMBER_DECORATORS_TO_REMOVE } from './decorators-to-static/decorators-constants';
import ts from 'typescript';

export const getScriptTarget = () => {
  // using a fn so the browser compiler doesn't require the global ts for startup
  return ts.ScriptTarget.ES2017;
};

export const isMemberPrivate = (member: ts.ClassElement) => {
  if (
    member.modifiers &&
    member.modifiers.some((m) => m.kind === ts.SyntaxKind.PrivateKeyword || m.kind === ts.SyntaxKind.ProtectedKeyword)
  ) {
    return true;
  }
  return false;
};

export const convertValueToLiteral = (val: any, refs: WeakSet<any> = null) => {
  if (refs == null) {
    refs = new WeakSet();
  }
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
    return arrayToArrayLiteral(val, refs);
  }
  if (typeof val === 'object') {
    if ((val as ConvertIdentifier).__identifier && (val as ConvertIdentifier).__escapedText) {
      return ts.createIdentifier((val as ConvertIdentifier).__escapedText);
    }
    return objectToObjectLiteral(val, refs);
  }
  return ts.createLiteral(val);
};

const arrayToArrayLiteral = (list: any[], refs: WeakSet<any>): ts.ArrayLiteralExpression => {
  const newList: any[] = list.map((l) => {
    return convertValueToLiteral(l, refs);
  });
  return ts.createArrayLiteral(newList);
};

const objectToObjectLiteral = (obj: { [key: string]: any }, refs: WeakSet<any>): ts.ObjectLiteralExpression => {
  if (refs.has(obj)) {
    return ts.createIdentifier('undefined') as any;
  }

  refs.add(obj);

  const newProperties: ts.ObjectLiteralElementLike[] = Object.keys(obj).map((key) => {
    const prop = ts.createPropertyAssignment(
      ts.createLiteral(key),
      convertValueToLiteral(obj[key], refs) as ts.Expression
    );
    return prop;
  });

  return ts.createObjectLiteral(newProperties, true);
};

export const createStaticGetter = (propName: string, returnExpression: ts.Expression) => {
  return ts.createGetAccessor(
    undefined,
    [ts.createToken(ts.SyntaxKind.StaticKeyword)],
    propName,
    undefined,
    undefined,
    ts.createBlock([ts.createReturn(returnExpression)])
  );
};

export const removeDecorators = (node: ts.Node, decoratorNames: Set<string>) => {
  if (node.decorators) {
    const updatedDecoratorList = node.decorators.filter((dec) => {
      const name =
        ts.isCallExpression(dec.expression) &&
        ts.isIdentifier(dec.expression.expression) &&
        dec.expression.expression.text;
      return !decoratorNames.has(name);
    });
    if (updatedDecoratorList.length === 0) {
      return undefined;
    } else if (updatedDecoratorList.length !== node.decorators.length) {
      return ts.createNodeArray(updatedDecoratorList);
    }
  }
  return node.decorators;
};

export const getStaticValue = (staticMembers: ts.ClassElement[], staticName: string): any => {
  const staticMember: ts.GetAccessorDeclaration = staticMembers.find(
    (member) => (member.name as any).escapedText === staticName
  ) as any;
  if (!staticMember || !staticMember.body || !staticMember.body.statements) {
    return null;
  }

  const rtnStatement: ts.ReturnStatement = staticMember.body.statements.find(
    (s) => s.kind === ts.SyntaxKind.ReturnStatement
  ) as any;
  if (!rtnStatement || !rtnStatement.expression) {
    return null;
  }

  const expKind = rtnStatement.expression.kind;
  if (expKind === ts.SyntaxKind.StringLiteral) {
    return (rtnStatement.expression as ts.StringLiteral).text;
  }

  if (expKind === ts.SyntaxKind.NoSubstitutionTemplateLiteral) {
    return (rtnStatement.expression as ts.NoSubstitutionTemplateLiteral).text;
  }

  if (expKind === ts.SyntaxKind.TrueKeyword) {
    return true;
  }

  if (expKind === ts.SyntaxKind.FalseKeyword) {
    return false;
  }

  if (expKind === ts.SyntaxKind.ObjectLiteralExpression) {
    return objectLiteralToObjectMap(rtnStatement.expression as any);
  }

  if (
    expKind === ts.SyntaxKind.ArrayLiteralExpression &&
    (rtnStatement.expression as ts.ArrayLiteralExpression).elements
  ) {
    return arrayLiteralToArray(rtnStatement.expression as any);
  }

  if (expKind === ts.SyntaxKind.Identifier) {
    const identifier = rtnStatement.expression as ts.Identifier;
    if (typeof identifier.escapedText === 'string') {
      return getIdentifierValue(identifier.escapedText);
    }

    if (identifier.escapedText) {
      const obj: any = {};
      Object.keys(identifier.escapedText).forEach((key) => {
        obj[key] = getIdentifierValue((identifier.escapedText as any)[key]);
      });
      return obj;
    }
  }

  return null;
};

export const arrayLiteralToArray = (arr: ts.ArrayLiteralExpression) => {
  return arr.elements.map((element) => {
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
};

export const objectLiteralToObjectMap = (objectLiteral: ts.ObjectLiteralExpression) => {
  const properties = objectLiteral.properties;
  const final: ObjectMap = {};

  for (const propAssignment of properties) {
    const propName = getTextOfPropertyName(propAssignment.name);
    let val: any;

    if (ts.isShorthandPropertyAssignment(propAssignment)) {
      val = getIdentifierValue(propName);
    } else if (ts.isPropertyAssignment(propAssignment)) {
      switch (propAssignment.initializer.kind) {
        case ts.SyntaxKind.ArrayLiteralExpression:
          val = arrayLiteralToArray(propAssignment.initializer as ts.ArrayLiteralExpression);
          break;

        case ts.SyntaxKind.ObjectLiteralExpression:
          val = objectLiteralToObjectMap(propAssignment.initializer as ts.ObjectLiteralExpression);
          break;

        case ts.SyntaxKind.StringLiteral:
          val = (propAssignment.initializer as ts.StringLiteral).text;
          break;

        case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
          val = (propAssignment.initializer as ts.StringLiteral).text;
          break;

        case ts.SyntaxKind.TrueKeyword:
          val = true;
          break;

        case ts.SyntaxKind.FalseKeyword:
          val = false;
          break;

        case ts.SyntaxKind.Identifier:
          const escapedText = (propAssignment.initializer as ts.Identifier).escapedText;
          if (escapedText === 'String') {
            val = String;
          } else if (escapedText === 'Number') {
            val = Number;
          } else if (escapedText === 'Boolean') {
            val = Boolean;
          } else if (escapedText === 'undefined') {
            val = undefined;
          } else if (escapedText === 'null') {
            val = null;
          } else {
            val = getIdentifierValue((propAssignment.initializer as ts.Identifier).escapedText);
          }
          break;

        case ts.SyntaxKind.PropertyAccessExpression:
        default:
          val = propAssignment.initializer;
      }
    }
    final[propName] = val;
  }

  return final;
};

const getIdentifierValue = (escapedText: any) => {
  const identifier: ConvertIdentifier = {
    __identifier: true,
    __escapedText: escapedText,
  };
  return identifier;
};

const getTextOfPropertyName = (propName: ts.PropertyName) => {
  switch (propName.kind) {
    case ts.SyntaxKind.Identifier:
      return (<ts.Identifier>propName).text;
    case ts.SyntaxKind.StringLiteral:
    case ts.SyntaxKind.NumericLiteral:
      return (<ts.LiteralExpression>propName).text;
    case ts.SyntaxKind.ComputedPropertyName:
      const expression = (<ts.ComputedPropertyName>propName).expression;
      if (ts.isStringLiteral(expression) || ts.isNumericLiteral(expression)) {
        return (<ts.LiteralExpression>(<ts.ComputedPropertyName>propName).expression).text;
      }
  }
  return undefined;
};

export class ObjectMap {
  [key: string]: ts.Expression | ObjectMap;
}

export const getAttributeTypeInfo = (baseNode: ts.Node, sourceFile: ts.SourceFile) => {
  const allReferences: d.ComponentCompilerTypeReferences = {};
  getAllTypeReferences(baseNode).forEach((rt) => {
    allReferences[rt] = getTypeReferenceLocation(rt, sourceFile);
  });
  return allReferences;
};

const getEntityName = (entity: ts.EntityName): string => {
  if (ts.isIdentifier(entity)) {
    return entity.escapedText.toString();
  } else {
    return getEntityName(entity.left);
  }
};

const getAllTypeReferences = (node: ts.Node) => {
  const referencedTypes: string[] = [];

  const visit = (node: ts.Node): ts.VisitResult<ts.Node> => {
    if (ts.isTypeReferenceNode(node)) {
      referencedTypes.push(getEntityName(node.typeName));
      if (node.typeArguments) {
        node.typeArguments
          .filter((ta) => ts.isTypeReferenceNode(ta))
          .forEach((tr: ts.TypeReferenceNode) => {
            const typeName = tr.typeName as ts.Identifier;
            if (typeName && typeName.escapedText) {
              referencedTypes.push(typeName.escapedText.toString());
            }
          });
      }
    }
    return ts.forEachChild(node, visit);
  };

  visit(node);

  return referencedTypes;
};

export const validateReferences = (
  diagnostics: d.Diagnostic[],
  references: d.ComponentCompilerTypeReferences,
  node: ts.Node
) => {
  Object.keys(references).forEach((refName) => {
    const ref = references[refName];
    if (ref.path === '@stencil/core' && MEMBER_DECORATORS_TO_REMOVE.has(refName)) {
      const err = buildError(diagnostics);
      augmentDiagnosticWithNode(err, node);
    }
  });
};

const getTypeReferenceLocation = (typeName: string, tsNode: ts.Node): d.ComponentCompilerTypeReference => {
  const sourceFileObj = tsNode.getSourceFile();

  // Loop through all top level imports to find any reference to the type for 'import' reference location
  const importTypeDeclaration = sourceFileObj.statements.find((st) => {
    const statement =
      ts.isImportDeclaration(st) &&
      st.importClause &&
      ts.isImportClause(st.importClause) &&
      st.importClause.namedBindings &&
      ts.isNamedImports(st.importClause.namedBindings) &&
      Array.isArray(st.importClause.namedBindings.elements) &&
      st.importClause.namedBindings.elements.find((nbe) => nbe.name.getText() === typeName);
    if (!statement) {
      return false;
    }
    return true;
  }) as ts.ImportDeclaration;

  if (importTypeDeclaration) {
    const localImportPath = (<ts.StringLiteral>importTypeDeclaration.moduleSpecifier).text;
    return {
      location: 'import',
      path: localImportPath,
    };
  }

  // Loop through all top level exports to find if any reference to the type for 'local' reference location
  const isExported = sourceFileObj.statements.some((st) => {
    // Is the interface defined in the file and exported
    const isInterfaceDeclarationExported =
      ts.isInterfaceDeclaration(st) &&
      (<ts.Identifier>st.name).getText() === typeName &&
      Array.isArray(st.modifiers) &&
      st.modifiers.some((mod) => mod.kind === ts.SyntaxKind.ExportKeyword);

    const isTypeAliasDeclarationExported =
      ts.isTypeAliasDeclaration(st) &&
      (<ts.Identifier>st.name).getText() === typeName &&
      Array.isArray(st.modifiers) &&
      st.modifiers.some((mod) => mod.kind === ts.SyntaxKind.ExportKeyword);

    // Is the interface exported through a named export
    const isTypeInExportDeclaration =
      ts.isExportDeclaration(st) &&
      ts.isNamedExports(st.exportClause) &&
      st.exportClause.elements.some((nee) => nee.name.getText() === typeName);

    return isInterfaceDeclarationExported || isTypeAliasDeclarationExported || isTypeInExportDeclaration;
  });

  if (isExported) {
    return {
      location: 'local',
    };
  }

  // This is most likely a global type, if it is a local that is not exported then typescript will inform the dev
  return {
    location: 'global',
  };
};

export const resolveType = (checker: ts.TypeChecker, type: ts.Type) => {
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
    parts = parts.map((p) => (p.indexOf('=>') >= 0 ? `(${p})` : p));
  }
  if (parts.length > 20) {
    return typeToString(checker, type);
  } else {
    return parts.join(' | ');
  }
};

export const typeToString = (checker: ts.TypeChecker, type: ts.Type) => {
  const TYPE_FORMAT_FLAGS =
    ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.InTypeAlias | ts.TypeFormatFlags.InElementType;

  return checker.typeToString(type, undefined, TYPE_FORMAT_FLAGS);
};

export const parseDocsType = (checker: ts.TypeChecker, type: ts.Type, parts: Set<string>) => {
  if (type.isUnion()) {
    (type as ts.UnionType).types.forEach((t) => {
      parseDocsType(checker, t, parts);
    });
  } else {
    const text = typeToString(checker, type);
    parts.add(text);
  }
};

export const getModuleFromSourceFile = (compilerCtx: d.CompilerCtx, tsSourceFile: ts.SourceFile) => {
  const sourceFilePath = normalizePath(tsSourceFile.fileName);
  const moduleFile = compilerCtx.moduleMap.get(sourceFilePath);
  if (moduleFile != null) {
    return moduleFile;
  }

  const moduleFiles = Array.from(compilerCtx.moduleMap.values());
  return moduleFiles.find((m) => m.jsFilePath === sourceFilePath);
};

export const getComponentMeta = (
  compilerCtx: d.CompilerCtx,
  tsSourceFile: ts.SourceFile,
  node: ts.ClassDeclaration
) => {
  const meta = compilerCtx.nodeMap.get(node);
  if (meta) {
    return meta;
  }

  const moduleFile = getModuleFromSourceFile(compilerCtx, tsSourceFile);
  if (moduleFile != null && node.members != null) {
    const staticMembers = node.members.filter(isStaticGetter);
    const tagName = getComponentTagName(staticMembers);
    if (typeof tagName === 'string') {
      return moduleFile.cmps.find((cmp) => cmp.tagName === tagName);
    }
  }
  return undefined;
};

export const getComponentTagName = (staticMembers: ts.ClassElement[]) => {
  if (staticMembers.length > 0) {
    const tagName = getStaticValue(staticMembers, 'is') as string;

    if (typeof tagName === 'string' && tagName.includes('-')) {
      return tagName;
    }
  }

  return null;
};

export const isStaticGetter = (member: ts.ClassElement) => {
  return (
    member.kind === ts.SyntaxKind.GetAccessor &&
    member.modifiers &&
    member.modifiers.some(({ kind }) => kind === ts.SyntaxKind.StaticKeyword)
  );
};

export const serializeSymbol = (checker: ts.TypeChecker, symbol: ts.Symbol): d.CompilerJsDoc => {
  if (!checker || !symbol) {
    return {
      tags: [],
      text: '',
    };
  }
  return {
    tags: mapJSDocTagInfo(symbol.getJsDocTags()),
    text: ts.displayPartsToString(symbol.getDocumentationComment(checker)),
  };
};

/**
 * Maps a TypeScript 4.3+ JSDocTagInfo to a flattened Stencil CompilerJsDocTagInfo.
 * @param tags A readonly array of JSDocTagInfo objects.
 * @returns An array of CompilerJsDocTagInfo objects.
 */
export const mapJSDocTagInfo = (tags: readonly ts.JSDocTagInfo[]): d.CompilerJsDocTagInfo[] => {
  // The text following a tag is split semantically by TS 4.3+, e.g. '@param foo the first parameter' ->
  // [{text: 'foo', kind: 'parameterName'}, {text: ' ', kind: 'space'}, {text: 'the first parameter', kind: 'text'}], so
  // we join the elements to reconstruct the text.
  return tags.map((tag) => ({ ...tag, text: tag.text?.map((part) => part.text).join('') }));
};

export const serializeDocsSymbol = (checker: ts.TypeChecker, symbol: ts.Symbol) => {
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
    parts = parts.map((p) => (p.indexOf('=>') >= 0 ? `(${p})` : p));
  }
  if (parts.length > 20) {
    return typeToString(checker, type);
  } else {
    return parts.join(' | ');
  }
};

export const isInternal = (jsDocs: d.CompilerJsDoc | undefined) => {
  return jsDocs && jsDocs.tags.some((s) => s.name === 'internal');
};

export const isMethod = (member: ts.ClassElement, methodName: string): member is ts.MethodDeclaration => {
  return ts.isMethodDeclaration(member) && member.name && (member.name as any).escapedText === methodName;
};

export const isAsyncFn = (typeChecker: ts.TypeChecker, methodDeclaration: ts.MethodDeclaration) => {
  if (methodDeclaration.modifiers) {
    if (methodDeclaration.modifiers.some((m) => m.kind === ts.SyntaxKind.AsyncKeyword)) {
      return true;
    }
  }

  const methodSignature = typeChecker.getSignatureFromDeclaration(methodDeclaration);
  const returnType = methodSignature.getReturnType();
  const typeStr = typeChecker.typeToString(
    returnType,
    undefined,
    ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.InTypeAlias | ts.TypeFormatFlags.InElementType
  );

  return typeStr.includes('Promise<');
};

export const createImportStatement = (importFnNames: string[], importPath: string) => {
  // ESM Imports
  // import { importNames } from 'importPath';

  const importSpecifiers = importFnNames.map((importKey) => {
    const splt = importKey.split(' as ');
    let importAs = importKey;
    let importFnName = importKey;

    if (splt.length > 1) {
      importAs = splt[1];
      importFnName = splt[0];
    }

    return ts.factory.createImportSpecifier(
      false,
      typeof importFnName === 'string' && importFnName !== importAs
        ? ts.factory.createIdentifier(importFnName)
        : undefined,
      ts.factory.createIdentifier(importAs)
    );
  });

  return ts.createImportDeclaration(
    undefined,
    undefined,
    ts.createImportClause(undefined, ts.createNamedImports(importSpecifiers)),
    ts.createLiteral(importPath)
  );
};

export const createRequireStatement = (importFnNames: string[], importPath: string) => {
  // CommonJS require()
  // const { a, b, c } = require(importPath);

  const importBinding = ts.createObjectBindingPattern(
    importFnNames.map((importKey) => {
      const splt = importKey.split(' as ');
      let importAs = importKey;
      let importFnName = importKey;

      if (splt.length > 1) {
        importAs = splt[1];
        importFnName = splt[0];
      }
      return ts.createBindingElement(undefined, importFnName, importAs);
    })
  );

  return ts.createVariableStatement(
    undefined,
    ts.createVariableDeclarationList(
      [
        ts.createVariableDeclaration(
          importBinding,
          undefined,
          ts.createCall(ts.createIdentifier('require'), [], [ts.createLiteral(importPath)])
        ),
      ],
      ts.NodeFlags.Const
    )
  );
};

export interface ConvertIdentifier {
  __identifier: boolean;
  __escapedText: string;
}
