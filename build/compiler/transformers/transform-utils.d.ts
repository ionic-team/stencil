import ts from 'typescript';
import type * as d from '../../declarations';
import { StencilStaticGetter } from './decorators-to-static/decorators-constants';
export declare const getScriptTarget: () => ts.ScriptTarget;
/**
 * Determine if a class member is private or not
 * @param member the class member to evaluate
 * @returns `true` if the member has the `private` or `protected` modifier attached to it. `false` otherwise
 */
export declare const isMemberPrivate: (member: ts.ClassElement) => boolean;
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
export declare const convertValueToLiteral: (val: any, refs?: WeakSet<any>) => ts.Identifier | ts.StringLiteral | ts.ObjectLiteralExpression | ts.ArrayLiteralExpression | ts.TrueLiteral | ts.FalseLiteral | ts.BigIntLiteral | ts.NumericLiteral;
/**
 * Create a TypeScript getter declaration AST node corresponding to a
 * supplied prop name and return value
 *
 * @param propName the name of the prop to access
 * @param returnExpression a TypeScript AST node to return from the getter
 * @returns an AST node representing a getter
 */
export declare const createStaticGetter: (propName: StencilStaticGetter, returnExpression: ts.Expression) => ts.GetAccessorDeclaration;
/**
 * Retrieves a value represented by TypeScript's syntax tree by name of a static getter. The value is transformed to a
 * runtime value.
 * @param staticMembers a collection of static getters to search
 * @param staticName the name of the static getter to pull a value from
 * @returns a TypeScript value, converted from its TypeScript syntax tree representation
 */
export declare const getStaticValue: (staticMembers: ts.ClassElement[], staticName: StencilStaticGetter) => any;
export declare const arrayLiteralToArray: (arr: ts.ArrayLiteralExpression) => any[];
export declare const objectLiteralToObjectMap: (objectLiteral: ts.ObjectLiteralExpression) => ObjectMap;
export declare class ObjectMap {
    [key: string]: ts.Expression | ObjectMap;
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
export declare const getAttributeTypeInfo: (baseNode: ts.Node, sourceFile: ts.SourceFile, checker: ts.TypeChecker, program: ts.Program) => d.ComponentCompilerTypeReferences;
interface TypeReferenceIR {
    name: string;
    type: ts.Type;
}
/**
 * Recursively walks the provided AST to collect all TypeScript type references that are found
 *
 * @param checker a {@link ts.TypeChecker} instance
 * @param node the node to walk to retrieve type information
 * @returns the collected type references
 */
export declare const getAllTypeReferences: (checker: ts.TypeChecker, node: ts.Node) => ReadonlyArray<TypeReferenceIR>;
export declare const validateReferences: (diagnostics: d.Diagnostic[], references: d.ComponentCompilerTypeReferences, node: ts.Node) => void;
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
export declare const resolveType: (checker: ts.TypeChecker, type: ts.Type) => string;
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
export declare const typeToString: (checker: ts.TypeChecker, type: ts.Type) => string;
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
export declare const parseDocsType: (checker: ts.TypeChecker, type: ts.Type, parts: Set<string>) => void;
/**
 * Retrieves a Stencil `Module` entity from the compiler context for a given TypeScript `SourceFile`
 * @param compilerCtx the current compiler context to retrieve the `Module` from
 * @param tsSourceFile the TypeScript compiler `SourceFile` entity to use to retrieve the `Module`
 * @returns the `Module`, or `undefined` if it cannot be found
 */
export declare const getModuleFromSourceFile: (compilerCtx: d.CompilerCtx, tsSourceFile: ts.SourceFile) => d.Module | undefined;
/**
 * Retrieve the Stencil metadata for a component from the current compiler context, based on the provided TypeScript
 * syntax tree node. The TypeScript source file is used as a fallback in the event the metadata cannot be found based
 * on the TypeScript node.
 * @param compilerCtx the current compiler context
 * @param tsSourceFile the TypeScript `SourceFile` entity
 * @param node a TypeScript class representation of a Stencil component
 * @returns the found metadata, or `undefined` if it cannot be found
 */
export declare const getComponentMeta: (compilerCtx: d.CompilerCtx, tsSourceFile: ts.SourceFile, node: ts.ClassDeclaration) => d.ComponentCompilerMeta | undefined;
/**
 * Retrieves the tag name associated with a Stencil component, based on the 'is' static getter assigned to the class at compile time
 * @param staticMembers the static getters belonging to the Stencil component class
 * @returns the tag name, or null if one cannot be found
 */
export declare const getComponentTagName: (staticMembers: ts.ClassElement[]) => string | null;
export declare const isStaticGetter: (member: ts.ClassElement) => boolean;
/**
 * Create a serialized representation of a TypeScript `Symbol` entity to expose the Symbol's text and attached JSDoc.
 * Note that the `Symbol` being serialized is not the same as the JavaScript primitive 'symbol'.
 * @param checker a reference to the TypeScript type checker
 * @param symbol the `Symbol` to serialize
 * @returns the serialized `Symbol` data
 */
export declare const serializeSymbol: (checker: ts.TypeChecker, symbol: ts.Symbol) => d.CompilerJsDoc;
/**
 * Maps a TypeScript 4.3+ JSDocTagInfo to a flattened Stencil CompilerJsDocTagInfo.
 * @param tags A readonly array of JSDocTagInfo objects.
 * @returns An array of CompilerJsDocTagInfo objects.
 */
export declare const mapJSDocTagInfo: (tags: readonly ts.JSDocTagInfo[]) => d.CompilerJsDocTagInfo[];
export declare const serializeDocsSymbol: (checker: ts.TypeChecker, symbol: ts.Symbol) => string;
/**
 * Given the JSDoc for a given bit of code, determine whether or not it is
 * marked 'internal'
 *
 * @param jsDocs the JSDoc to examine
 * @returns whether the JSDoc is marked 'internal' or not
 */
export declare const isInternal: (jsDocs: d.CompilerJsDoc | undefined) => boolean;
export declare const isMethod: (member: ts.ClassElement, methodName: string) => member is ts.MethodDeclaration;
export declare const createImportStatement: (importFnNames: string[], importPath: string) => ts.ImportDeclaration;
export declare const createRequireStatement: (importFnNames: string[], importPath: string) => ts.VariableStatement;
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
export declare const retrieveModifierLike: (node: ts.Node) => ReadonlyArray<ts.ModifierLike>;
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
export declare const retrieveTsDecorators: (node: ts.Node) => ReadonlyArray<ts.Decorator> | undefined;
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
export declare const retrieveTsModifiers: (node: ts.Node) => ReadonlyArray<ts.Modifier> | undefined;
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
export declare const updateConstructor: (classNode: ts.ClassDeclaration, classMembers: ts.ClassElement[], statements: ts.Statement[], parameters?: ts.ParameterDeclaration[]) => ts.ClassElement[];
/**
 * Given a {@link ts.PropertyDeclaration} node get its name as a string
 *
 * @param node a property decl node
 * @param typeChecker a reference to the {@link ts.TypeChecker}
 * @returns the name of the property in string form
 */
export declare const tsPropDeclNameAsString: (node: ts.PropertyDeclaration, typeChecker: ts.TypeChecker) => string;
export {};
