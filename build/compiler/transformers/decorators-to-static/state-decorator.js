import ts from 'typescript';
import { createStaticGetter, retrieveTsDecorators, tsPropDeclNameAsString } from '../transform-utils';
import { isDecoratorNamed } from './decorator-utils';
/**
 * Convert class fields decorated with `@State` to static getters
 *
 * This function takes a list of decorated properties pulled off of a class
 * declaration AST Node and builds up equivalent static getter AST nodes
 * with which they can be replaced.
 *
 * @param decoratedProps TypeScript AST nodes representing class members
 * @param newMembers an out param containing new class members
 * @param typeChecker a reference to the TypeScript type checker
 */
export const stateDecoratorsToStatic = (decoratedProps, newMembers, typeChecker) => {
    const states = decoratedProps
        .filter(ts.isPropertyDeclaration)
        .map((prop) => stateDecoratorToStatic(prop, typeChecker))
        .filter((state) => !!state);
    if (states.length > 0) {
        newMembers.push(createStaticGetter('states', ts.factory.createObjectLiteralExpression(states, true)));
    }
};
/**
 * Convert a property declaration decorated with `@State` to a property
 * assignment AST node which maps the name of the state property to an empty
 * object.
 *
 * Note that this function will return null if the property declaration is
 * decorated with other decorators.
 *
 * @param prop A TypeScript AST node representing a class property declaration
 * @param typeChecker a reference to the TypeScript type checker
 * @returns a property assignment AST Node which maps the name of the state
 * prop to an empty object
 */
const stateDecoratorToStatic = (prop, typeChecker) => {
    var _a;
    const stateDecorator = (_a = retrieveTsDecorators(prop)) === null || _a === void 0 ? void 0 : _a.find(isDecoratorNamed('State'));
    if (stateDecorator == null) {
        return null;
    }
    const stateName = tsPropDeclNameAsString(prop, typeChecker);
    return ts.factory.createPropertyAssignment(ts.factory.createStringLiteral(stateName), ts.factory.createObjectLiteralExpression([], true));
};
//# sourceMappingURL=state-decorator.js.map