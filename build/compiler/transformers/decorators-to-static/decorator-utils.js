import ts from 'typescript';
import { objectLiteralToObjectMap } from '../transform-utils';
export const getDecoratorParameters = (decorator, typeChecker) => {
    if (!ts.isCallExpression(decorator.expression)) {
        return [];
    }
    return decorator.expression.arguments.map((arg) => getDecoratorParameter(arg, typeChecker));
};
const getDecoratorParameter = (arg, typeChecker) => {
    if (ts.isObjectLiteralExpression(arg)) {
        return objectLiteralToObjectMap(arg);
    }
    else if (ts.isStringLiteral(arg)) {
        return arg.text;
    }
    else if (ts.isPropertyAccessExpression(arg) || ts.isIdentifier(arg)) {
        const type = typeChecker.getTypeAtLocation(arg);
        if (type !== undefined && type.isLiteral()) {
            /**
             * Using enums or variables require us to resolve the value for
             * the computed property/identifier via the TS type checker. As long
             * as the type resolves to a literal, we can grab its value to be used
             * as the `@Watch()` decorator argument.
             */
            return type.value;
        }
    }
    throw new Error(`invalid decorator argument: ${arg.getText()}`);
};
/**
 * Returns a function that checks if a decorator:
 * - is a call expression. these are decorators that are immediately followed by open/close parenthesis with optional
 *   arg(s), e.g. `@Prop()`
 * - the name of the decorator matches the provided `propName`
 *
 * @param propName the name of the decorator to match against
 * @returns true if the conditions above are both true, false otherwise
 */
export const isDecoratorNamed = (propName) => {
    return (dec) => {
        return ts.isCallExpression(dec.expression) && dec.expression.expression.getText() === propName;
    };
};
//# sourceMappingURL=decorator-utils.js.map