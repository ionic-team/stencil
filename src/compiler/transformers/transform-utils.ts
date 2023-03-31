import { augmentDiagnosticWithNode, buildError, normalizePath, readOnlyArrayHasStringMember } from '@utils';
import ts from 'typescript';

import type * as d from '../../declarations';
import { MEMBER_DECORATORS_TO_REMOVE } from './decorators-to-static/decorators-constants';

export const getScriptTarget = () => {
  // using a fn so the browser compiler doesn't require the global ts for startup
  return ts.ScriptTarget.ES2017;
};

/**
 * Determine if a class member is private or not
 * @param member the class member to evaluate
 * @returns `true` if the member has the `private` or `protected` modifier attached to it. `false` otherwise
 */
export const isMemberPrivate = (member: ts.ClassElement): boolean => {
  return !!retrieveTsModifiers(member)?.some(
    (m) => m.kind === ts.SyntaxKind.PrivateKeyword || m.kind === ts.SyntaxKind.ProtectedKeyword
  );
};

/**
 * Convert a JavaScript value to the TypeScript Intermediate Representation
 * (IR) for a literal Abstract Syntax Tree (AST) node with that same value. The
 * value to convert may be a primitive type like `string`, `boolean`, etc or
 * may be an `Object`, `Array`, etc.
 *
 * Note that this function takes a param (`refs`) with a default value,
 * normally a value should _not_ be passed for this parameter since it is
 * intended to be used for recursive calls.
 *
 * @param val the value to convert
 * @param refs a set of references, used in recursive calls to avoid
 * circular references when creating object literal IR instances. **note that
 * you shouldn't pass this parameter unless you know what you're doing!**
 * @returns TypeScript IR for a literal corresponding to the JavaScript value
 * with which the function was called
 */
export const convertValueToLiteral = (
  val: any,
  refs: WeakSet<any> = null
):
  | ts.Identifier
  | ts.StringLiteral
  | ts.ObjectLiteralExpression
  | ts.ArrayLiteralExpression
  | ts.TrueLiteral
  | ts.FalseLiteral
  | ts.BigIntLiteral
  | ts.NumericLiteral => {
  if (refs == null) {
    refs = new WeakSet();
  }
  if (val === String) {
    return ts.factory.createIdentifier('String');
  }
  if (val === Number) {
    return ts.factory.createIdentifier('Number');
  }
  if (val === Boolean) {
    return ts.factory.createIdentifier('Boolean');
  }
  if (val === undefined) {
    return ts.factory.createIdentifier('undefined');
  }
  if (val === null) {
    return ts.factory.createIdentifier('null');
  }
  if (Array.isArray(val)) {
    return arrayToArrayLiteral(val, refs);
  }
  if (typeof val === 'object') {
    if ((val as ConvertIdentifier).__identifier && (val as ConvertIdentifier).__escapedText) {
      return ts.factory.createIdentifier((val as ConvertIdentifier).__escapedText);
    }
    return objectToObjectLiteral(val, refs);
  }

  // the remainder of the implementation of this function was derived from the deprecated `createLiteral` function
  // found in typescript@4.8.4
  if (typeof val === 'number') {
    return ts.factory.createNumericLiteral(val);
  }
  if (typeof val === 'object' && 'base10Value' in val) {
    return ts.factory.createBigIntLiteral(val);
  }
  if (typeof val === 'boolean') {
    return val ? ts.factory.createTrue() : ts.factory.createFalse();
  }
  if (typeof val === 'string') {
    return ts.factory.createStringLiteral(val, undefined);
  }

  return ts.factory.createStringLiteralFromNode(val);
};

/**
 * Convert a JavaScript Array instance to TypeScript's Intermediate
 * Representation (IR) for an array literal. This is done by recursively using
 * {@link convertValueToLiteral} to create a new array consisting of the
 * TypeScript IR of each element in the array to be converted, and then creating
 * the TypeScript IR for _that_ array.
 *
 * @param list the array instance to convert
 * @param refs a set of references to objects, used when converting objects to
 * avoid circular references
 * @returns TypeScript IR for the array we want to convert
 */
const arrayToArrayLiteral = (list: any[], refs: WeakSet<any>): ts.ArrayLiteralExpression => {
  const newList: any[] = list.map((l) => {
    return convertValueToLiteral(l, refs);
  });
  return ts.factory.createArrayLiteralExpression(newList);
};

/**
 * Convert a JavaScript object (i.e. an object existing at runtime) to the
 * corresponding TypeScript Intermediate Representation (IR)
 * ({@see ts.ObjectLiteralExpression}) for an object literal. This function
 * takes an argument holding a `WeakSet` of references to objects which is
 * used to avoid circular references. Objects that are converted in this
 * function are added to the set, and if an object is already present then an
 * `undefined` literal (in TypeScript IR) is returned instead of another
 * object literal, as continuing to convert a circular reference would, well,
 * never end!
 *
 * @param obj the JavaScript object to convert to TypeScript IR
 * @param refs a set of references to objects, used to avoid circular references
 * @returns a TypeScript object literal expression
 */
const objectToObjectLiteral = (obj: { [key: string]: any }, refs: WeakSet<any>): ts.ObjectLiteralExpression => {
  if (refs.has(obj)) {
    return ts.factory.createIdentifier('undefined') as any;
  }

  refs.add(obj);

  const newProperties: ts.ObjectLiteralElementLike[] = Object.keys(obj).map((key) => {
    const prop = ts.factory.createPropertyAssignment(
      ts.factory.createStringLiteral(key),
      convertValueToLiteral(obj[key], refs) as ts.Expression
    );
    return prop;
  });

  return ts.factory.createObjectLiteralExpression(newProperties, true);
};

/**
 * Create a TypeScript getter declaration AST node corresponding to a
 * supplied prop name and return value
 *
 * @param propName the name of the prop to access
 * @param returnExpression a TypeScript AST node to return from the getter
 * @returns an AST node representing a getter
 */
export const createStaticGetter = (propName: string, returnExpression: ts.Expression): ts.GetAccessorDeclaration => {
  return ts.factory.createGetAccessorDeclaration(
    [ts.factory.createToken(ts.SyntaxKind.StaticKeyword)],
    propName,
    [],
    undefined,
    ts.factory.createBlock([ts.factory.createReturnStatement(returnExpression)])
  );
};

/**
 * Retrieves a value represented by TypeScript's syntax tree by name of a static getter. The value is transformed to a
 * runtime value.
 * @param staticMembers a collection of static getters to search
 * @param staticName the name of the static getter to pull a value from
 * @returns a TypeScript value, converted from its TypeScript syntax tree representation
 */
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

/**
 * Generate a series of type references for a given AST node
 * @param baseNode the AST node to pull type references from
 * @param sourceFile the source file in which the provided `baseNode` exists
 * @returns the generated series of type references
 */
export const getAttributeTypeInfo = (
  baseNode: ts.Node,
  sourceFile: ts.SourceFile
): d.ComponentCompilerTypeReferences => {
  const allReferences: d.ComponentCompilerTypeReferences = {};
  getAllTypeReferences(baseNode).forEach((typeName: string) => {
    allReferences[typeName] = getTypeReferenceLocation(typeName, sourceFile);
  });
  return allReferences;
};

/**
 * Get the text-based name from a TypeScript `EntityName`, which is an identifier of some form
 * @param entity a TypeScript `EntityName` to retrieve the name of an entity from
 * @returns the entity's name
 */
const getEntityName = (entity: ts.EntityName): string => {
  if (ts.isIdentifier(entity)) {
    return entity.escapedText.toString();
  } else {
    // We have qualified name - e.g. const x: Foo.Bar.Baz;
    // Recurse until we find the 'base' of the qualified name
    return getEntityName(entity.left);
  }
};

/**
 * Recursively walks the provided AST to collect all TypeScript type references that are found
 * @param node the node to walk to retrieve type information
 * @returns the collected type references
 */
const getAllTypeReferences = (node: ts.Node): ReadonlyArray<string> => {
  const referencedTypes: string[] = [];

  const visit = (node: ts.Node): ts.VisitResult<ts.Node> => {
    /**
     * A type reference node will refer to some type T.
     * e.g: In `const foo: Bar = {...}` the reference node will contain semantic information about `Bar`.
     * In TypeScript, types that are also keywords (e.g. `number` in `const foo: number`) are not `TypeReferenceNode`s.
     */
    if (ts.isTypeReferenceNode(node)) {
      referencedTypes.push(getEntityName(node.typeName));
      if (node.typeArguments) {
        // a type may contain types itself (e.g. generics - Foo<Bar>)
        node.typeArguments
          .filter((typeArg: ts.TypeNode): typeArg is ts.TypeReferenceNode => ts.isTypeReferenceNode(typeArg))
          .forEach((typeRef: ts.TypeReferenceNode) => {
            const typeName = typeRef.typeName as ts.Identifier;
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
    if (ref.path === '@stencil/core' && readOnlyArrayHasStringMember(MEMBER_DECORATORS_TO_REMOVE, refName)) {
      const err = buildError(diagnostics);
      augmentDiagnosticWithNode(err, node);
    }
  });
};

/**
 * Determine where a TypeScript type reference originates from. This is accomplished by interrogating the AST node in
 * which the type's name appears
 *
 * A type may originate:
 * - from the same file where it is used (a type is declared in some file, `foo.ts`, and later used in the same file)
 * - from another file (I.E. it is imported and should have an import statement somewhere in the file)
 * - from a global context
 * - etc.
 *
 * The type may be declared using the `type` or `interface` keywords.
 *
 * @param typeName the name of the type to find the origination of
 * @param tsNode the TypeScript AST node being searched for the provided `typeName`
 * @returns the context stating where the type originates from
 */
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
    const statementModifiers = retrieveTsModifiers(st);

    // Is the interface defined in the file and exported
    const isInterfaceDeclarationExported =
      ts.isInterfaceDeclaration(st) &&
      (<ts.Identifier>st.name).getText() === typeName &&
      Array.isArray(statementModifiers) &&
      statementModifiers.some((mod) => mod.kind === ts.SyntaxKind.ExportKeyword);

    const isTypeAliasDeclarationExported =
      ts.isTypeAliasDeclaration(st) &&
      (<ts.Identifier>st.name).getText() === typeName &&
      Array.isArray(statementModifiers) &&
      statementModifiers.some((mod) => mod.kind === ts.SyntaxKind.ExportKeyword);

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
      // If this is a local import, we know the path to the type
      // is the same as the current source file path
      //
      // We need to explicitly include the path here because
      // future logic for generating app types will use this resolved reference
      // to ensure that type name collisions do no occur in the output type
      // declaration file. If this path is omitted, the correct aliased type names
      // will not be used for component event definitions
      path: sourceFileObj.fileName,
    };
  }

  // This is most likely a global type, if it is a local that is not exported then typescript will inform the dev
  return {
    location: 'global',
  };
};

/**
 * Resolve a type annotation, using the TypeScript typechecker to convert a
 * {@link ts.Type} record to a string.
 *
 * For instance, assume there's a module `foo.ts` which exports a type `Foo`
 * which looks like this:
 *
 * ```ts
 * // foo.ts
 * type Foo = (b: string) => boolean;
 * ```
 *
 * and then a module `bar.ts` which imports `Foo` and uses it to annotate a
 * variable declaration like so:
 *
 * ```ts
 * // bar.ts
 * import { Foo } from './foo';
 *
 * let foo: Foo | undefined;
 * ```
 *
 * If this function is called with the {@link ts.Type} object corresponding to
 * the {@link ts.Node} object for the `foo` variable, it will return something
 * like:
 *
 * ```ts
 * "(b: string) => boolean | undefined";
 * ```
 *
 * @param checker a typescript typechecker
 * @param type the type to resolve
 * @returns a resolved, user-readable string
 */
export const resolveType = (checker: ts.TypeChecker, type: ts.Type): string => {
  const set = new Set<string>();
  parseDocsType(checker, type, set);

  // normalize booleans
  const hasTrue = set.delete('true');
  const hasFalse = set.delete('false');
  if (hasTrue || hasFalse) {
    set.add('boolean');
  }

  let parts = Array.from(set.keys()).sort();
  // TODO(STENCIL-366): Get this section of code under tests that directly exercise this behavior
  if (parts.length > 1) {
    parts = parts.map((p) => (p.indexOf('=>') >= 0 ? `(${p})` : p));
  }
  if (parts.length > 20) {
    return typeToString(checker, type);
  } else {
    return parts.join(' | ');
  }
};

/**
 * Formats a TypeScript `Type` entity as a string
 *
 * @param checker a reference to the TypeScript type checker
 * @param type a TypeScript `Type` entity to format
 * @returns the formatted string
 */
export const typeToString = (checker: ts.TypeChecker, type: ts.Type): string => {
  const TYPE_FORMAT_FLAGS =
    ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.InTypeAlias | ts.TypeFormatFlags.InElementType;

  return checker.typeToString(type, undefined, TYPE_FORMAT_FLAGS);
};

/**
 * Parse a type into its component parts, recursively dealing with each variant
 * if it is a union type.
 *
 * **Note**: this function will mutate the `parts` set, adding new strings for
 * any types it finds.
 *
 * @param checker a TypeScript typechecker instance
 * @param type a TypeScript type
 * @param parts an out param that holds parts of the type annotation we're
 * assembling
 */
export const parseDocsType = (checker: ts.TypeChecker, type: ts.Type, parts: Set<string>): void => {
  if (type.isUnion()) {
    (type as ts.UnionType).types.forEach((t) => {
      parseDocsType(checker, t, parts);
    });
  } else {
    const text = typeToString(checker, type);
    parts.add(text);
  }
};

/**
 * Retrieves a Stencil `Module` entity from the compiler context for a given TypeScript `SourceFile`
 * @param compilerCtx the current compiler context to retrieve the `Module` from
 * @param tsSourceFile the TypeScript compiler `SourceFile` entity to use to retrieve the `Module`
 * @returns the `Module`, or `undefined` if it cannot be found
 */
export const getModuleFromSourceFile = (
  compilerCtx: d.CompilerCtx,
  tsSourceFile: ts.SourceFile
): d.Module | undefined => {
  const sourceFilePath = normalizePath(tsSourceFile.fileName);
  const moduleFile = compilerCtx.moduleMap.get(sourceFilePath);
  if (moduleFile != null) {
    return moduleFile;
  }

  // a key with the `Module`'s filename could not be found, attempt to resolve it by iterating over all modules in the
  // compiler context
  const moduleFiles = Array.from(compilerCtx.moduleMap.values());
  return moduleFiles.find((m) => m.jsFilePath === sourceFilePath);
};

/**
 * Retrieve the Stencil metadata for a component from the current compiler context, based on the provided TypeScript
 * syntax tree node. The TypeScript source file is used as a fallback in the event the metadata cannot be found based
 * on the TypeScript node.
 * @param compilerCtx the current compiler context
 * @param tsSourceFile the TypeScript `SourceFile` entity
 * @param node a TypeScript class representation of a Stencil component
 * @returns the found metadata, or `undefined` if it cannot be found
 */
export const getComponentMeta = (
  compilerCtx: d.CompilerCtx,
  tsSourceFile: ts.SourceFile,
  node: ts.ClassDeclaration
): d.ComponentCompilerMeta | undefined => {
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

/**
 * Retrieves the tag name associated with a Stencil component, based on the 'is' static getter assigned to the class at compile time
 * @param staticMembers the static getters belonging to the Stencil component class
 * @returns the tage name, or null if one cannot be found
 */
export const getComponentTagName = (staticMembers: ts.ClassElement[]): string | null => {
  if (staticMembers.length > 0) {
    const tagName = getStaticValue(staticMembers, 'is') as string;

    if (typeof tagName === 'string' && tagName.includes('-')) {
      return tagName;
    }
  }

  return null;
};

export const isStaticGetter = (member: ts.ClassElement): boolean => {
  const modifiers = retrieveTsModifiers(member);
  return (
    (member.kind === ts.SyntaxKind.GetAccessor &&
      Array.isArray(modifiers) &&
      modifiers.some(({ kind }) => kind === ts.SyntaxKind.StaticKeyword)) ??
    false
  );
};

/**
 * Create a serialized representation of a TypeScript `Symbol` entity to expose the Symbol's text and attached JSDoc.
 * Note that the `Symbol` being serialized is not the same as the JavaScript primitive 'symbol'.
 * @param checker a reference to the TypeScript type checker
 * @param symbol the `Symbol` to serialize
 * @returns the serialized `Symbol` data
 */
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
  // TODO(STENCIL-365): Replace this with `return resolveType()`;
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

  return ts.factory.createImportDeclaration(
    undefined,
    ts.factory.createImportClause(false, undefined, ts.factory.createNamedImports(importSpecifiers)),
    ts.factory.createStringLiteral(importPath)
  );
};

export const createRequireStatement = (importFnNames: string[], importPath: string) => {
  // CommonJS require()
  // const { a, b, c } = require(importPath);

  const importBinding = ts.factory.createObjectBindingPattern(
    importFnNames.map((importKey) => {
      const splt = importKey.split(' as ');
      let importAs = importKey;
      let importFnName = importKey;

      if (splt.length > 1) {
        importAs = splt[1];
        importFnName = splt[0];
      }
      return ts.factory.createBindingElement(undefined, importFnName, importAs);
    })
  );

  return ts.factory.createVariableStatement(
    undefined,
    ts.factory.createVariableDeclarationList(
      [
        ts.factory.createVariableDeclaration(
          importBinding,
          undefined,
          undefined,
          ts.factory.createCallExpression(
            ts.factory.createIdentifier('require'),
            [],
            [ts.factory.createStringLiteral(importPath)]
          )
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

/**
 * Helper method for retrieving all decorators & modifiers from a TypeScript {@link ts.Node} entity.
 *
 * Starting with TypeScript v4.8, decorators and modifiers have been coalesced into a single field, and retrieving
 * decorators directly has been deprecated. This helper function pulls all decorators & modifiers out of said field.
 *
 * @see {@link https://devblogs.microsoft.com/typescript/announcing-typescript-4-8/#decorators-are-placed-on-modifiers-on-typescripts-syntax-trees|The TypeScript 4.8 Announcement}
 *
 * @param node the node to pull decorators & modifiers out of
 * @returns a list containing decorators & modifiers on the node
 */
export const retrieveModifierLike = (node: ts.Node): ReadonlyArray<ts.ModifierLike> => {
  return [...(retrieveTsDecorators(node) ?? []), ...(retrieveTsModifiers(node) ?? [])];
};

/**
 * Helper method for retrieving decorators from a TypeScript {@link ts.Node} entity.
 *
 * Starting with TypeScript v4.8, decorators and modifiers have been coalesced into a single field, and retrieving
 * decorators directly has been deprecated. This helper function is a utility that wraps various helper functions that
 * the TypeScript compiler exposes for pulling decorators out of said field.
 *
 * @see {@link https://devblogs.microsoft.com/typescript/announcing-typescript-4-8/#decorators-are-placed-on-modifiers-on-typescripts-syntax-trees|The TypeScript 4.8 Announcement}
 *
 * @param node the node to pull decorators out of
 * @returns a list containing 1+ decorators on the node, otherwise undefined
 */
export const retrieveTsDecorators = (node: ts.Node): ReadonlyArray<ts.Decorator> | undefined => {
  return ts.canHaveDecorators(node) ? ts.getDecorators(node) : undefined;
};

/**
 * Helper method for retrieving modifiers from a TypeScript {@link ts.Node} entity.
 *
 * Starting with TypeScript v4.8, decorators and modifiers have been coalesced into a single field, and retrieving
 * modifiers directly has been deprecated. This helper function is a utility that wraps various helper functions that
 * the TypeScript compiler exposes for pulling modifiers out of said field.
 *
 * @see {@link https://devblogs.microsoft.com/typescript/announcing-typescript-4-8/#decorators-are-placed-on-modifiers-on-typescripts-syntax-trees|The TypeScript 4.8 Announcement}
 *
 * @param node the node to pull modifiers out of
 * @returns a list containing 1+ modifiers on the node, otherwise undefined
 */
export const retrieveTsModifiers = (node: ts.Node): ReadonlyArray<ts.Modifier> | undefined => {
  return ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined;
};
