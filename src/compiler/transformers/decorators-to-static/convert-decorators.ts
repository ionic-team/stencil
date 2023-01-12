import { augmentDiagnosticWithNode, buildError } from '@utils';
import ts from 'typescript';

import type * as d from '../../../declarations';
import { retrieveTsDecorators, retrieveTsModifiers } from '../transform-utils';
import { componentDecoratorToStatic } from './component-decorator';
import { isDecoratorNamed } from './decorator-utils';
import {
  CLASS_DECORATORS_TO_REMOVE,
  CONSTRUCTOR_DEFINED_MEMBER_DECORATORS,
  MEMBER_DECORATORS_TO_REMOVE,
} from './decorators-constants';
import { elementDecoratorsToStatic } from './element-decorator';
import { eventDecoratorsToStatic } from './event-decorator';
import { listenDecoratorsToStatic } from './listen-decorator';
import { methodDecoratorsToStatic, validateMethods } from './method-decorator';
import { propDecoratorsToStatic } from './prop-decorator';
import { stateDecoratorsToStatic } from './state-decorator';
import { watchDecoratorsToStatic } from './watch-decorator';

export const convertDecoratorsToStatic = (
  config: d.Config,
  diagnostics: d.Diagnostic[],
  typeChecker: ts.TypeChecker
): ts.TransformerFactory<ts.SourceFile> => {
  return (transformCtx) => {
    const visit = (node: ts.Node): ts.VisitResult<ts.Node> => {
      if (ts.isClassDeclaration(node)) {
        return visitClassDeclaration(config, diagnostics, typeChecker, node);
      }
      return ts.visitEachChild(node, visit, transformCtx);
    };

    return (tsSourceFile) => {
      return ts.visitEachChild(tsSourceFile, visit, transformCtx);
    };
  };
};

const visitClassDeclaration = (
  config: d.Config,
  diagnostics: d.Diagnostic[],
  typeChecker: ts.TypeChecker,
  classNode: ts.ClassDeclaration
) => {
  const componentDecorator = retrieveTsDecorators(classNode)?.find(isDecoratorNamed('Component'));
  if (!componentDecorator) {
    return classNode;
  }

  const classMembers = classNode.members;
  const decoratedMembers = classMembers.filter((member) => (retrieveTsDecorators(member)?.length ?? 0) > 0);

  // create an array of all class members which are _not_ methods decorated
  // with a Stencil decorator. We do this here because we'll implement the
  // behavior specified for those decorated methods later on.
  const filteredMethodsAndFields = removeStencilMethodDecorators(Array.from(classMembers), diagnostics);

  // parser component decorator (Component)
  componentDecoratorToStatic(config, typeChecker, diagnostics, classNode, filteredMethodsAndFields, componentDecorator);

  // stores a reference to fields that should be watched for changes
  const watchable = new Set<string>();
  // parse member decorators (Prop, State, Listen, Event, Method, Element and Watch)
  if (decoratedMembers.length > 0) {
    propDecoratorsToStatic(diagnostics, decoratedMembers, typeChecker, watchable, filteredMethodsAndFields);
    stateDecoratorsToStatic(decoratedMembers, watchable, filteredMethodsAndFields);
    eventDecoratorsToStatic(diagnostics, decoratedMembers, typeChecker, filteredMethodsAndFields);
    methodDecoratorsToStatic(config, diagnostics, classNode, decoratedMembers, typeChecker, filteredMethodsAndFields);
    elementDecoratorsToStatic(diagnostics, decoratedMembers, typeChecker, filteredMethodsAndFields);
    watchDecoratorsToStatic(config, diagnostics, decoratedMembers, watchable, filteredMethodsAndFields);
    listenDecoratorsToStatic(diagnostics, decoratedMembers, filteredMethodsAndFields);
  }

  // We call the `handleClassFields` method which handles transforming any
  // class fields, removing them from the class and adding statements to the
  // class' constructor which instantiate them there instead.
  const updatedClassFields = handleClassFields(classNode, filteredMethodsAndFields);

  validateMethods(diagnostics, classMembers);

  const currentDecorators = retrieveTsDecorators(classNode);
  return ts.factory.updateClassDeclaration(
    classNode,
    [
      ...(filterDecorators(currentDecorators, CLASS_DECORATORS_TO_REMOVE) ?? []),
      ...(retrieveTsModifiers(classNode) ?? []),
    ],
    classNode.name,
    classNode.typeParameters,
    classNode.heritageClauses,
    updatedClassFields
  );
};

/**
 * Take a list of `ClassElement` AST nodes and remove any decorators from
 * method elements which are Stencil-specific decorators. We implement the
 * intended behavior for these Stencil-specific decorators (things like
 * `@Watch`, `@State`, etc) through a combination of compile- and
 * run-time changes, scaffolding, etc.
 *
 * This utility modifies these class elements to remove any Stencil-specific
 * decorators.
 *
 * @param classMembers a list of ClassElement AST nodes
 * @param diagnostics a collection of compiler diagnostics, to which an error
 * may be added
 * @returns a new list of the same ClassElement nodes, with any nodes which have
 * Stencil-specific decorators modified to remove them
 */
const removeStencilMethodDecorators = (
  classMembers: ts.ClassElement[],
  diagnostics: d.Diagnostic[]
): ts.ClassElement[] => {
  return classMembers.map((member) => {
    const currentDecorators = retrieveTsDecorators(member);
    const newDecorators = filterDecorators(currentDecorators, MEMBER_DECORATORS_TO_REMOVE);

    if (currentDecorators !== newDecorators) {
      if (ts.isMethodDeclaration(member)) {
        return ts.factory.updateMethodDeclaration(
          member,
          [...(newDecorators ?? []), ...(retrieveTsModifiers(member) ?? [])],
          member.asteriskToken,
          member.name,
          member.questionToken,
          member.typeParameters,
          member.parameters,
          member.type,
          member.body
        );
      } else if (ts.isPropertyDeclaration(member)) {
        if (shouldInitializeInConstructor(member)) {
          // if the current class member is decorated with either 'State' or
          // 'Prop' we need to modify the property declaration to transform it
          // from a class field but we handle this in the `handleClassFields`
          // method below, so we just want to return the class member here
          // untouched.
          return member;
        } else {
          // update the property to remove decorators
          const modifiers = retrieveTsModifiers(member);
          return ts.factory.updatePropertyDeclaration(
            member,
            [...(newDecorators ?? []), ...(modifiers ?? [])],
            member.name,
            member.questionToken,
            member.type,
            member.initializer
          );
        }
      } else {
        const err = buildError(diagnostics);
        err.messageText = 'Unknown class member encountered!';
        augmentDiagnosticWithNode(err, member);
      }
    }
    return member;
  });
};

/**
 * Generate a list of decorators from a syntax tree node that are not in a provided exclude list
 *
 * @param decorators the syntax tree node's decorators should be inspected
 * @param excludeList the names of decorators that should _not_ be included in the returned list
 * @returns a list of decorators on the AST node that are not in the provided list, or `undefined` if:
 * - there are no decorators on the node
 * - the node contains only decorators in the provided list
 */
export const filterDecorators = (
  decorators: ReadonlyArray<ts.Decorator> | undefined,
  excludeList: ReadonlyArray<string>
): ReadonlyArray<ts.Decorator> | undefined => {
  if (decorators) {
    const updatedDecoratorList = decorators.filter((dec) => {
      // narrow the type of the syntax tree node, while retrieving the text of the identifier
      const decoratorName =
        ts.isCallExpression(dec.expression) &&
        ts.isIdentifier(dec.expression.expression) &&
        dec.expression.expression.text;
      // if the type narrowing logic short-circuited (i.e. returned 'false'), always return those decorators
      // otherwise, check if it is included in the provided exclude list
      return typeof decoratorName === 'boolean' || !excludeList.includes(decoratorName);
    });
    if (updatedDecoratorList.length === 0) {
      // handle the case of a zero-length list first, so an empty array is not created
      return undefined;
    } else if (updatedDecoratorList.length !== decorators.length) {
      // the updated decorator list is non-zero, but has a different length than the original decorator list,
      // create a new array of nodes from it
      return ts.factory.createNodeArray(updatedDecoratorList);
    }
  }

  // return the node's original decorators, or undefined
  return decorators;
};

/**
 * This updates a Stencil component class declaration AST node to handle any
 * class fields with Stencil-specific decorators (`@State`, `@Prop`, etc). For
 * reasons explained below, we need to remove these fields from the class and
 * add code to the class's constructor to instantiate them manually.
 *
 * When a class field is decorated with a Stencil-defined decorator, we rely on
 * defining our own setters and getters (using `Object.defineProperty`) to
 * implement the behavior we want. Unfortunately, in ES2022 and newer versions
 * of the EcmaScript standard the behavior for class fields like the following
 * is incompatible with using manually-defined getters and setters:
 *
 * ```ts
 * class MyClass {
 *   foo = "bar"
 * }
 * ```
 *
 * In ES2022+ if we try to use `Object.defineProperty` on this class's
 * prototype in order to define a `set` and `get` function for the
 * property `foo` it will not override the default behavior of the
 * instance field `foo`, so doing something like the following:
 *
 * ```ts
 * Object.defineProperty(MyClass.prototype, "foo", {
 *   get() {
 *     return "Foo is: " + this.foo
 *   }
 * });
 * ```
 *
 * and then calling `myClassInstance.foo` will _not_ return `"Foo is: bar"` but
 * just `"bar"`. This is because the standard ECMAScript behavior is now to use
 * the internals of `Object.defineProperty` on a class instance to instantiate
 * fields, and that call at instantiation-time overrides what's set on the
 * prototype. For details, see the accepted ECMAScript proposal for this
 * behavior:
 *
 * https://github.com/tc39/proposal-class-fields#public-fields-created-with-objectdefineproperty
 *
 * Why is this important? With `target` set to an ECMAScript version prior to
 * ES2022 TypeScript by default would emit a class which instantiated the field
 * in its constructor, something like this:
 *
 * ```ts
 * class CompiledMyClass {
 *   constructor() {
 *     this.foo = "bar"
 *   }
 * }
 * ```
 *
 * This plays nicely with later using `Object.defineProperty` on the prototype
 * to define getters and setters, or simply with defining them right on the
 * class (see the code in `proxyComponent`, `proxyCustomElement`, and friends).
 *
 * However, with a `target` of ES2022 or higher (e.g. `ESNext`) default
 * behavior for TypeScript is instead to emit code like this:
 *
 * ```ts
 * class CompiledMyClass {
 *   foo = "bar"
 * }
 * ```
 *
 * This output is more correct because the compiled code 1) more closely
 * resembles the TypeScript source and 2) is using standard JS syntax instead
 * of desugaring it. There is an announcement in the release notes for
 * TypeScript v3.7 which explains some helpful background about the change,
 * and about the `useDefineForClassFields` TypeScript option which lets you
 * opt-in to the old output:
 *
 * https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#the-usedefineforclassfields-flag-and-the-declare-property-modifier
 *
 * For our use-case, however, the ES2022+ behavior doesn't work, since we need
 * to be able to define getters and setters on these fields. We could require
 * that the TypeScript configuration used for Stencil have the
 * `useDefineForClassFields` setting set to `false`, but that would have the
 * undesirable side-effect that class fields which are _not_
 * decorated with a Stencil decorator would also be instantiated in the
 * constructor.
 *
 * So instead, we take matters into our own hands. When we encounter a class
 * field which is decorated with a Stencil decorator we remove it from the
 * class and add a statement to the constructor to instantiate it with the
 * correct default value.
 *
 * **Note**: this function will modify a constructor if one is already present on
 * the class or define a new one otherwise.
 *
 * @param classNode a TypeScript AST node for a Stencil component class
 * @param classMembers the class members that we need to update
 * @returns a list of updated class elements which can be inserted into the class
 */
function handleClassFields(classNode: ts.ClassDeclaration, classMembers: ts.ClassElement[]): ts.ClassElement[] {
  const statements: ts.ExpressionStatement[] = [];
  const updatedClassMembers: ts.ClassElement[] = [];

  for (const member of classMembers) {
    if (shouldInitializeInConstructor(member) && ts.isPropertyDeclaration(member)) {
      const declarationName: ts.DeclarationName = ts.getNameOfDeclaration(member);

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
      // In this case we need to get the expression which evaluates to some
      // valid property name and call `.getText` on it. In the case that it's
      // _not_ a computed property name, like
      //
      // ```ts
      // class MyClass {
      //   argName = "best property around";
      // }
      // ```
      //
      // we can just call `.getText` on the name itself.
      const memberName =
        declarationName.kind === ts.SyntaxKind.ComputedPropertyName
          ? declarationName.expression.getText()
          : declarationName.getText();

      // this is a class field that we'll need to handle, so lets push a statement for
      // initializing the value onto our statements list
      statements.push(
        ts.factory.createExpressionStatement(
          ts.factory.createBinaryExpression(
            ts.factory.createPropertyAccessExpression(ts.factory.createThis(), ts.factory.createIdentifier(memberName)),
            ts.factory.createToken(ts.SyntaxKind.EqualsToken),
            // if the member has no initializer we should default to setting it to
            // just 'undefined'
            member.initializer ?? ts.factory.createIdentifier('undefined')
          )
        )
      );
    } else {
      // if it's not a class field that is decorated with a Stencil decorator then
      // we just push it onto our class member list
      updatedClassMembers.push(member);
    }
  }

  if (statements.length === 0) {
    // we didn't encounter any class fields we need to update, so we can
    // just return the list of class members (no need to create an empty
    // constructor)
    return updatedClassMembers;
  } else {
    // create or update a constructor which contains the initializing statements
    // we created above
    return updateConstructor(classNode, updatedClassMembers, statements);
  }
}

/**
 * Helper util for updating the constructor on a class declaration AST node.
 *
 * @param classNode the class node whose constructor will be updated
 * @param classMembers a list of class members for that class
 * @param statements a list of statements which should be added to the
 * constructor
 * @returns a list of updated class elements
 */
export const updateConstructor = (
  classNode: ts.ClassDeclaration,
  classMembers: ts.ClassElement[],
  statements: ts.Statement[]
): ts.ClassElement[] => {
  const constructorIndex = classMembers.findIndex((m) => m.kind === ts.SyntaxKind.Constructor);
  const constructorMethod = classMembers[constructorIndex];

  if (constructorIndex >= 0 && ts.isConstructorDeclaration(constructorMethod)) {
    const constructorBodyStatements: ts.NodeArray<ts.Statement> =
      constructorMethod.body?.statements ?? ts.factory.createNodeArray();
    const hasSuper = constructorBodyStatements.some((s) => s.kind === ts.SyntaxKind.SuperKeyword);

    if (!hasSuper && needsSuper(classNode)) {
      // if there is no super and it needs one the statements comprising the
      // body of the constructor should be:
      //
      // 1. the `super()` call
      // 2. the new statements we've created to initialize fields
      // 3. the statements currently comprising the body of the constructor
      statements = [createConstructorBodyWithSuper(), ...statements, ...constructorBodyStatements];
    } else {
      // if no super is needed then the body of the constructor should be:
      //
      // 1. the new statements we've created to initialize fields
      // 2. the statements currently comprising the body of the constructor
      statements = [...statements, ...constructorBodyStatements];
    }

    classMembers[constructorIndex] = ts.factory.updateConstructorDeclaration(
      constructorMethod,
      retrieveTsModifiers(constructorMethod),
      constructorMethod.parameters,
      ts.factory.updateBlock(constructorMethod?.body ?? ts.factory.createBlock([]), statements)
    );
  } else {
    // we don't seem to have a constructor, so let's create one and stick it
    // into the array of class elements
    if (needsSuper(classNode)) {
      statements = [createConstructorBodyWithSuper(), ...statements];
    }

    classMembers = [
      ts.factory.createConstructorDeclaration(undefined, [], ts.factory.createBlock(statements, true)),
      ...classMembers,
    ];
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
const needsSuper = (classDeclaration: ts.ClassDeclaration): boolean => {
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
const createConstructorBodyWithSuper = (): ts.ExpressionStatement => {
  return ts.factory.createExpressionStatement(
    ts.factory.createCallExpression(ts.factory.createIdentifier('super'), undefined, undefined)
  );
};

/**
 * Check whether a given class element should be rewritten from a class field
 * to a constructor-initialized value. This is basically the case for fields
 * decorated with `@Prop` and `@State`. See {@link handleClassFields} for more
 * details.
 *
 * @param member the member to check
 * @returns whether this should be rewritten or not
 */
const shouldInitializeInConstructor = (member: ts.ClassElement): boolean => {
  const currentDecorators = retrieveTsDecorators(member);
  if (currentDecorators === undefined) {
    // decorators have already been removed from this element, indicating that
    // we don't need to do anything
    return false;
  }
  const filteredDecorators = filterDecorators(currentDecorators, CONSTRUCTOR_DEFINED_MEMBER_DECORATORS);
  return currentDecorators !== filteredDecorators;
};
