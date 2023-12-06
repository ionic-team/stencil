import { augmentDiagnosticWithNode, buildError, normalizePath, readOnlyArrayHasStringMember } from '@utils';
import ts from 'typescript';
import { MEMBER_DECORATORS_TO_REMOVE } from './decorators-to-static/decorators-constants';
import { addToLibrary, findTypeWithName, getHomeModule, getOriginalTypeName } from './type-library';
export const getScriptTarget = () => {
    // using a fn so the browser compiler doesn't require the global ts for startup
    return ts.ScriptTarget.ES2017;
};
/**
 * Determine if a class member is private or not
 * @param member the class member to evaluate
 * @returns `true` if the member has the `private` or `protected` modifier attached to it. `false` otherwise
 */
export const isMemberPrivate = (member) => {
    var _a;
    return !!((_a = retrieveTsModifiers(member)) === null || _a === void 0 ? void 0 : _a.some((m) => m.kind === ts.SyntaxKind.PrivateKeyword || m.kind === ts.SyntaxKind.ProtectedKeyword));
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
export const convertValueToLiteral = (val, refs = null) => {
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
        if (val.__identifier && val.__escapedText) {
            return ts.factory.createIdentifier(val.__escapedText);
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
const arrayToArrayLiteral = (list, refs) => {
    const newList = list.map((l) => {
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
const objectToObjectLiteral = (obj, refs) => {
    if (refs.has(obj)) {
        return ts.factory.createIdentifier('undefined');
    }
    refs.add(obj);
    const newProperties = Object.keys(obj).map((key) => {
        const prop = ts.factory.createPropertyAssignment(ts.factory.createStringLiteral(key), convertValueToLiteral(obj[key], refs));
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
export const createStaticGetter = (propName, returnExpression) => {
    return ts.factory.createGetAccessorDeclaration([ts.factory.createToken(ts.SyntaxKind.StaticKeyword)], propName, [], undefined, ts.factory.createBlock([ts.factory.createReturnStatement(returnExpression)]));
};
/**
 * Retrieves a value represented by TypeScript's syntax tree by name of a static getter. The value is transformed to a
 * runtime value.
 * @param staticMembers a collection of static getters to search
 * @param staticName the name of the static getter to pull a value from
 * @returns a TypeScript value, converted from its TypeScript syntax tree representation
 */
export const getStaticValue = (staticMembers, staticName) => {
    const staticMember = staticMembers.find((member) => member.name.escapedText === staticName);
    if (!staticMember || !staticMember.body || !staticMember.body.statements) {
        return null;
    }
    const rtnStatement = staticMember.body.statements.find((s) => s.kind === ts.SyntaxKind.ReturnStatement);
    if (!rtnStatement || !rtnStatement.expression) {
        return null;
    }
    const expKind = rtnStatement.expression.kind;
    if (expKind === ts.SyntaxKind.StringLiteral) {
        return rtnStatement.expression.text;
    }
    if (expKind === ts.SyntaxKind.NoSubstitutionTemplateLiteral) {
        return rtnStatement.expression.text;
    }
    if (expKind === ts.SyntaxKind.TrueKeyword) {
        return true;
    }
    if (expKind === ts.SyntaxKind.FalseKeyword) {
        return false;
    }
    if (expKind === ts.SyntaxKind.ObjectLiteralExpression) {
        return objectLiteralToObjectMap(rtnStatement.expression);
    }
    if (expKind === ts.SyntaxKind.ArrayLiteralExpression &&
        rtnStatement.expression.elements) {
        return arrayLiteralToArray(rtnStatement.expression);
    }
    if (expKind === ts.SyntaxKind.Identifier) {
        const identifier = rtnStatement.expression;
        if (typeof identifier.escapedText === 'string') {
            return getIdentifierValue(identifier.escapedText);
        }
        if (identifier.escapedText) {
            const obj = {};
            Object.keys(identifier.escapedText).forEach((key) => {
                obj[key] = getIdentifierValue(identifier.escapedText[key]);
            });
            return obj;
        }
    }
    return null;
};
export const arrayLiteralToArray = (arr) => {
    return arr.elements.map((element) => {
        let val;
        switch (element.kind) {
            case ts.SyntaxKind.ObjectLiteralExpression:
                val = objectLiteralToObjectMap(element);
                break;
            case ts.SyntaxKind.StringLiteral:
                val = element.text;
                break;
            case ts.SyntaxKind.TrueKeyword:
                val = true;
                break;
            case ts.SyntaxKind.FalseKeyword:
                val = false;
                break;
            case ts.SyntaxKind.Identifier:
                const escapedText = element.escapedText;
                if (escapedText === 'String') {
                    val = String;
                }
                else if (escapedText === 'Number') {
                    val = Number;
                }
                else if (escapedText === 'Boolean') {
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
export const objectLiteralToObjectMap = (objectLiteral) => {
    const properties = objectLiteral.properties;
    const final = {};
    for (const propAssignment of properties) {
        const propName = getTextOfPropertyName(propAssignment.name);
        let val;
        if (ts.isShorthandPropertyAssignment(propAssignment)) {
            val = getIdentifierValue(propName);
        }
        else if (ts.isPropertyAssignment(propAssignment)) {
            switch (propAssignment.initializer.kind) {
                case ts.SyntaxKind.ArrayLiteralExpression:
                    val = arrayLiteralToArray(propAssignment.initializer);
                    break;
                case ts.SyntaxKind.ObjectLiteralExpression:
                    val = objectLiteralToObjectMap(propAssignment.initializer);
                    break;
                case ts.SyntaxKind.StringLiteral:
                    val = propAssignment.initializer.text;
                    break;
                case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
                    val = propAssignment.initializer.text;
                    break;
                case ts.SyntaxKind.TrueKeyword:
                    val = true;
                    break;
                case ts.SyntaxKind.FalseKeyword:
                    val = false;
                    break;
                case ts.SyntaxKind.Identifier:
                    const escapedText = propAssignment.initializer.escapedText;
                    if (escapedText === 'String') {
                        val = String;
                    }
                    else if (escapedText === 'Number') {
                        val = Number;
                    }
                    else if (escapedText === 'Boolean') {
                        val = Boolean;
                    }
                    else if (escapedText === 'undefined') {
                        val = undefined;
                    }
                    else if (escapedText === 'null') {
                        val = null;
                    }
                    else {
                        val = getIdentifierValue(propAssignment.initializer.escapedText);
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
const getIdentifierValue = (escapedText) => {
    const identifier = {
        __identifier: true,
        __escapedText: escapedText,
    };
    return identifier;
};
const getTextOfPropertyName = (propName) => {
    switch (propName.kind) {
        case ts.SyntaxKind.Identifier:
            return propName.text;
        case ts.SyntaxKind.StringLiteral:
        case ts.SyntaxKind.NumericLiteral:
            return propName.text;
        case ts.SyntaxKind.ComputedPropertyName:
            const expression = propName.expression;
            if (ts.isStringLiteral(expression) || ts.isNumericLiteral(expression)) {
                return propName.expression.text;
            }
    }
    return undefined;
};
export class ObjectMap {
}
/**
 * Generate a series of type references for a given AST node
 *
 * @param baseNode the AST node to pull type references from
 * @param sourceFile the source file in which the provided `baseNode` exists
 * @param checker a {@link ts.TypeChecker} instance
 * @param program a {@link ts.Program} object
 * @returns the generated series of type references
 */
export const getAttributeTypeInfo = (baseNode, sourceFile, checker, program) => {
    const allReferences = {};
    getAllTypeReferences(checker, baseNode).forEach((typeInfo) => {
        const { name, type } = typeInfo;
        allReferences[name] = getTypeReferenceLocation(name, type, sourceFile, checker, program);
    });
    return allReferences;
};
/**
 * Get the text-based name from a TypeScript `EntityName`, which is an identifier of some form
 * @param entity a TypeScript `EntityName` to retrieve the name of an entity from
 * @returns the entity's name
 */
const getEntityName = (entity) => {
    if (ts.isIdentifier(entity)) {
        return entity.escapedText.toString();
    }
    else {
        // We have qualified name - e.g. const x: Foo.Bar.Baz;
        // Recurse until we find the 'base' of the qualified name
        return getEntityName(entity.left);
    }
};
/**
 * Recursively walks the provided AST to collect all TypeScript type references that are found
 *
 * @param checker a {@link ts.TypeChecker} instance
 * @param node the node to walk to retrieve type information
 * @returns the collected type references
 */
export const getAllTypeReferences = (checker, node) => {
    const referencedTypes = [];
    const visit = (node) => {
        /**
         * A type reference node will refer to some type T.
         * e.g: In `const foo: Bar = {...}` the reference node will contain semantic information about `Bar`.
         * In TypeScript, types that are also keywords (e.g. `number` in `const foo: number`) are not `TypeReferenceNode`s.
         */
        if (ts.isTypeReferenceNode(node)) {
            referencedTypes.push({
                name: getEntityName(node.typeName),
                type: checker.getTypeFromTypeNode(node),
            });
            if (node.typeArguments) {
                // a type may contain types itself (e.g. generics - Foo<Bar>)
                node.typeArguments
                    .filter((typeArg) => ts.isTypeReferenceNode(typeArg))
                    .forEach((typeRef) => {
                    const typeName = typeRef.typeName;
                    if (typeName && typeName.escapedText) {
                        referencedTypes.push({
                            name: typeName.escapedText.toString(),
                            type: checker.getTypeFromTypeNode(typeRef),
                        });
                    }
                });
            }
        }
        return ts.forEachChild(node, visit);
    };
    visit(node);
    return referencedTypes;
};
export const validateReferences = (diagnostics, references, node) => {
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
 * @param type the type in question
 * @param sourceFile the TypeScript AST node being searched for the provided `typeName`
 * @param checker a TypeScript typechecker instance
 * @param program a {@link ts.Program} object
 * @returns the context stating where the type originates from
 */
const getTypeReferenceLocation = (typeName, type, sourceFile, checker, program) => {
    var _a;
    // Loop through all top level imports to find any reference to the type for 'import' reference location
    const importTypeDeclaration = sourceFile.statements.find((st) => {
        const statement = ts.isImportDeclaration(st) &&
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
    });
    const namedImportBindings = (_a = importTypeDeclaration === null || importTypeDeclaration === void 0 ? void 0 : importTypeDeclaration.importClause) === null || _a === void 0 ? void 0 : _a.namedBindings;
    if (importTypeDeclaration && ts.isNamedImports(namedImportBindings)) {
        // in order to calculate this type's ID and add it to the type library we
        // need to resolve its home module and find its original declaration.
        const localImportPath = importTypeDeclaration.moduleSpecifier.text;
        const options = program.getCompilerOptions();
        const compilerHost = ts.createCompilerHost(options);
        const importHomeModule = getHomeModule(sourceFile, localImportPath, options, compilerHost, program);
        if (importHomeModule) {
            const importName = namedImportBindings.elements.find((nbe) => nbe.name.getText() === typeName).name;
            const originalTypeName = getOriginalTypeName(importName, checker);
            const typeDecl = findTypeWithName(importHomeModule, originalTypeName);
            type = checker.getTypeAtLocation(typeDecl);
            const id = addToLibrary(type, originalTypeName, checker, normalizePath(importHomeModule.fileName, false));
            return {
                location: 'import',
                path: localImportPath,
                id,
            };
        }
    }
    // Loop through all top level exports to find if any reference to the type for 'local' reference location
    const isExported = sourceFile.statements.some((st) => {
        const statementModifiers = retrieveTsModifiers(st);
        const isDeclarationExported = (statement) => statement.name.getText() === typeName &&
            Array.isArray(statementModifiers) &&
            statementModifiers.some((mod) => mod.kind === ts.SyntaxKind.ExportKeyword);
        // Is the interface defined in the file and exported
        const isInterfaceDeclarationExported = ts.isInterfaceDeclaration(st) && isDeclarationExported(st);
        const isTypeAliasDeclarationExported = ts.isTypeAliasDeclaration(st) && isDeclarationExported(st);
        const isEnumDeclarationExported = ts.isEnumDeclaration(st) && isDeclarationExported(st);
        // Is the interface exported through a named export
        const isTypeInExportDeclaration = ts.isExportDeclaration(st) &&
            ts.isNamedExports(st.exportClause) &&
            st.exportClause.elements.some((nee) => nee.name.getText() === typeName);
        return (isInterfaceDeclarationExported ||
            isTypeAliasDeclarationExported ||
            isEnumDeclarationExported ||
            isTypeInExportDeclaration);
    });
    if (isExported) {
        const id = addToLibrary(type, typeName, checker, sourceFile.fileName);
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
            path: sourceFile.fileName,
            id,
        };
    }
    // This is most likely a global type, if it is a local that is not exported then typescript will inform the dev
    return {
        location: 'global',
        id: 'global::' + typeName,
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
export const resolveType = (checker, type) => {
    const set = new Set();
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
    }
    else {
        return parts.join(' | ');
    }
};
/**
 * Formats a TypeScript `Type` entity as a string
 *
 * Note: this is essentially an opinionated alias for the
 * {@link ts.TypeChecker.typeToString} method.
 *
 * @param checker a reference to the TypeScript type checker
 * @param type a TypeScript `Type` entity to format
 * @returns the formatted string
 */
export const typeToString = (checker, type) => {
    const TYPE_FORMAT_FLAGS = ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.InTypeAlias | ts.TypeFormatFlags.InElementType;
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
export const parseDocsType = (checker, type, parts) => {
    if (type.isUnion()) {
        type.types.forEach((t) => {
            parseDocsType(checker, t, parts);
        });
    }
    else {
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
export const getModuleFromSourceFile = (compilerCtx, tsSourceFile) => {
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
export const getComponentMeta = (compilerCtx, tsSourceFile, node) => {
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
 * @returns the tag name, or null if one cannot be found
 */
export const getComponentTagName = (staticMembers) => {
    if (staticMembers.length > 0) {
        const tagName = getStaticValue(staticMembers, 'is');
        if (typeof tagName === 'string' && tagName.includes('-')) {
            return tagName;
        }
    }
    return null;
};
export const isStaticGetter = (member) => {
    var _a;
    const modifiers = retrieveTsModifiers(member);
    return ((_a = (member.kind === ts.SyntaxKind.GetAccessor &&
        Array.isArray(modifiers) &&
        modifiers.some(({ kind }) => kind === ts.SyntaxKind.StaticKeyword))) !== null && _a !== void 0 ? _a : false);
};
/**
 * Create a serialized representation of a TypeScript `Symbol` entity to expose the Symbol's text and attached JSDoc.
 * Note that the `Symbol` being serialized is not the same as the JavaScript primitive 'symbol'.
 * @param checker a reference to the TypeScript type checker
 * @param symbol the `Symbol` to serialize
 * @returns the serialized `Symbol` data
 */
export const serializeSymbol = (checker, symbol) => {
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
export const mapJSDocTagInfo = (tags) => {
    // The text following a tag is split semantically by TS 4.3+, e.g. '@param foo the first parameter' ->
    // [{text: 'foo', kind: 'parameterName'}, {text: ' ', kind: 'space'}, {text: 'the first parameter', kind: 'text'}], so
    // we join the elements to reconstruct the text.
    return tags.map((tag) => { var _a; return ({ ...tag, text: (_a = tag.text) === null || _a === void 0 ? void 0 : _a.map((part) => part.text).join('') }); });
};
export const serializeDocsSymbol = (checker, symbol) => {
    const type = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
    // TODO(STENCIL-365): Replace this with `return resolveType()`;
    const set = new Set();
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
    }
    else {
        return parts.join(' | ');
    }
};
/**
 * Given the JSDoc for a given bit of code, determine whether or not it is
 * marked 'internal'
 *
 * @param jsDocs the JSDoc to examine
 * @returns whether the JSDoc is marked 'internal' or not
 */
export const isInternal = (jsDocs) => {
    return !!(jsDocs && jsDocs.tags.some((s) => s.name === 'internal'));
};
export const isMethod = (member, methodName) => {
    return ts.isMethodDeclaration(member) && member.name && member.name.escapedText === methodName;
};
export const createImportStatement = (importFnNames, importPath) => {
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
        return ts.factory.createImportSpecifier(false, typeof importFnName === 'string' && importFnName !== importAs
            ? ts.factory.createIdentifier(importFnName)
            : undefined, ts.factory.createIdentifier(importAs));
    });
    return ts.factory.createImportDeclaration(undefined, ts.factory.createImportClause(false, undefined, ts.factory.createNamedImports(importSpecifiers)), ts.factory.createStringLiteral(importPath));
};
export const createRequireStatement = (importFnNames, importPath) => {
    // CommonJS require()
    // const { a, b, c } = require(importPath);
    const importBinding = ts.factory.createObjectBindingPattern(importFnNames.map((importKey) => {
        const splt = importKey.split(' as ');
        let importAs = importKey;
        let importFnName = importKey;
        if (splt.length > 1) {
            importAs = splt[1];
            importFnName = splt[0];
        }
        return ts.factory.createBindingElement(undefined, importFnName, importAs);
    }));
    return ts.factory.createVariableStatement(undefined, ts.factory.createVariableDeclarationList([
        ts.factory.createVariableDeclaration(importBinding, undefined, undefined, ts.factory.createCallExpression(ts.factory.createIdentifier('require'), [], [ts.factory.createStringLiteral(importPath)])),
    ], ts.NodeFlags.Const));
};
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
export const retrieveModifierLike = (node) => {
    var _a, _b;
    return [...((_a = retrieveTsDecorators(node)) !== null && _a !== void 0 ? _a : []), ...((_b = retrieveTsModifiers(node)) !== null && _b !== void 0 ? _b : [])];
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
export const retrieveTsDecorators = (node) => {
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
export const retrieveTsModifiers = (node) => {
    return ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined;
};
/**
 * Helper util for updating the constructor on a class declaration AST node.
 *
 * @param classNode the class node whose constructor will be updated
 * @param classMembers a list of class members for that class
 * @param statements a list of statements which should be added to the
 * constructor
 * @param parameters an optional list of parameters for the constructor
 * @returns a list of updated class elements
 */
export const updateConstructor = (classNode, classMembers, statements, parameters) => {
    var _a, _b, _c;
    const constructorIndex = classMembers.findIndex((m) => m.kind === ts.SyntaxKind.Constructor);
    const constructorMethod = classMembers[constructorIndex];
    if (constructorIndex >= 0 && ts.isConstructorDeclaration(constructorMethod)) {
        const constructorBodyStatements = (_b = (_a = constructorMethod.body) === null || _a === void 0 ? void 0 : _a.statements) !== null && _b !== void 0 ? _b : ts.factory.createNodeArray();
        const hasSuper = constructorBodyStatements.some((s) => s.kind === ts.SyntaxKind.SuperKeyword);
        if (!hasSuper && needsSuper(classNode)) {
            // if there is no super and it needs one the statements comprising the
            // body of the constructor should be:
            //
            // 1. the `super()` call
            // 2. the new statements we've created to initialize fields
            // 3. the statements currently comprising the body of the constructor
            statements = [createConstructorBodyWithSuper(), ...statements, ...constructorBodyStatements];
        }
        else {
            // if no super is needed then the body of the constructor should be:
            //
            // 1. the new statements we've created
            // 2. the statements currently comprising the body of the constructor
            statements = [...statements, ...constructorBodyStatements];
        }
        classMembers[constructorIndex] = ts.factory.updateConstructorDeclaration(constructorMethod, retrieveTsModifiers(constructorMethod), constructorMethod.parameters.concat(parameters !== null && parameters !== void 0 ? parameters : []), ts.factory.updateBlock((_c = constructorMethod === null || constructorMethod === void 0 ? void 0 : constructorMethod.body) !== null && _c !== void 0 ? _c : ts.factory.createBlock([]), statements));
    }
    else {
        // we don't seem to have a constructor, so let's create one and stick it
        // into the array of class elements
        if (needsSuper(classNode)) {
            statements = [createConstructorBodyWithSuper(), ...statements];
        }
        // add the new constructor to the class members, putting it at the
        // beginning
        classMembers.unshift(ts.factory.createConstructorDeclaration(undefined, parameters !== null && parameters !== void 0 ? parameters : [], ts.factory.createBlock(statements, true)));
    }
    return classMembers;
};
/**
 * Check that a given class declaration should have a `super()` call in its
 * constructor. This is something we can check by looking for a
 * {@link ts.HeritageClause} on the class's AST node.
 *
 * @param classDeclaration a class declaration AST node
 * @returns whether this class has parents or not
 */
const needsSuper = (classDeclaration) => {
    const hasHeritageClauses = classDeclaration.heritageClauses && classDeclaration.heritageClauses.length > 0;
    if (hasHeritageClauses) {
        // A {@link ts.SyntaxKind.HeritageClause} node may be for extending a
        // superclass _or_ for implementing an interface. We only want to add a
        // `super()` call to our synthetic constructor here in the case that there
        // is a superclass, so we can check for that situation by checking for the
        // presence of a heritage clause with the `.token` property set to
        // `ts.SyntaxKind.ExtendsKeyword`.
        return classDeclaration.heritageClauses.some((clause) => clause.token === ts.SyntaxKind.ExtendsKeyword);
    }
    return false;
};
/**
 * Create a statement with a call to `super()` suitable for including in the body of a constructor.
 * @returns a {@link ts.ExpressionStatement} node equivalent to `super()`
 */
const createConstructorBodyWithSuper = () => {
    return ts.factory.createExpressionStatement(ts.factory.createCallExpression(ts.factory.createIdentifier('super'), undefined, undefined));
};
/**
 * Given a {@link ts.PropertyDeclaration} node get its name as a string
 *
 * @param node a property decl node
 * @param typeChecker a reference to the {@link ts.TypeChecker}
 * @returns the name of the property in string form
 */
export const tsPropDeclNameAsString = (node, typeChecker) => {
    const declarationName = ts.getNameOfDeclaration(node);
    // The name of a class field declaration can be a computed property name,
    // like so:
    //
    // ```ts
    // const argName = "arghhh"
    //
    // class MyClass {
    //   [argName] = "best property around";
    // }
    // ```
    //
    // In this case we need to evaluate the expression via the typechecker to get the literal
    // value of the property. In the case that it's _not_ a computed property name, like
    //
    // ```ts
    // class MyClass {
    //   argName = "best property around";
    // }
    // ```
    //
    // we can just call `.getText` on the name itself.
    let memberName = declarationName.getText();
    if (ts.isComputedPropertyName(declarationName)) {
        const type = typeChecker.getTypeAtLocation(declarationName.expression);
        if (type != null && type.isLiteral()) {
            memberName = type.value.toString();
        }
    }
    return memberName;
};
//# sourceMappingURL=transform-utils.js.map