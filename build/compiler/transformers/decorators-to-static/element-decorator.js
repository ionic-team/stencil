import { buildError } from '@utils';
import ts from 'typescript';
import { createStaticGetter, retrieveTsDecorators } from '../transform-utils';
import { isDecoratorNamed } from './decorator-utils';
export const elementDecoratorsToStatic = (diagnostics, decoratedMembers, typeChecker, newMembers) => {
    const elementRefs = decoratedMembers
        .filter(ts.isPropertyDeclaration)
        .map((prop) => parseElementDecorator(diagnostics, typeChecker, prop))
        .filter((element) => !!element);
    if (elementRefs.length > 0) {
        newMembers.push(createStaticGetter('elementRef', ts.factory.createStringLiteral(elementRefs[0])));
        if (elementRefs.length > 1) {
            const error = buildError(diagnostics);
            error.messageText = `It's not valid to add more than one Element() decorator`;
        }
    }
};
const parseElementDecorator = (_diagnostics, _typeChecker, prop) => {
    var _a;
    const elementDecorator = (_a = retrieveTsDecorators(prop)) === null || _a === void 0 ? void 0 : _a.find(isDecoratorNamed('Element'));
    if (elementDecorator == null) {
        return null;
    }
    return prop.name.getText();
};
//# sourceMappingURL=element-decorator.js.map