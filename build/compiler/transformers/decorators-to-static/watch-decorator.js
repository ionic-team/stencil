import { flatOne } from '@utils';
import ts from 'typescript';
import { convertValueToLiteral, createStaticGetter, retrieveTsDecorators } from '../transform-utils';
import { getDecoratorParameters, isDecoratorNamed } from './decorator-utils';
export const watchDecoratorsToStatic = (typeChecker, decoratedProps, newMembers) => {
    const watchers = decoratedProps
        .filter(ts.isMethodDeclaration)
        .map((method) => parseWatchDecorator(typeChecker, method));
    const flatWatchers = flatOne(watchers);
    if (flatWatchers.length > 0) {
        newMembers.push(createStaticGetter('watchers', convertValueToLiteral(flatWatchers)));
    }
};
const parseWatchDecorator = (typeChecker, method) => {
    var _a;
    const methodName = method.name.getText();
    const decorators = (_a = retrieveTsDecorators(method)) !== null && _a !== void 0 ? _a : [];
    return decorators.filter(isDecoratorNamed('Watch')).map((decorator) => {
        const [propName] = getDecoratorParameters(decorator, typeChecker);
        return {
            propName,
            methodName,
        };
    });
};
//# sourceMappingURL=watch-decorator.js.map