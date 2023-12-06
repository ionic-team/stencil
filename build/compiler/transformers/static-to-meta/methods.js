import { getStaticValue, isInternal } from '../transform-utils';
export const parseStaticMethods = (staticMembers) => {
    const parsedMethods = getStaticValue(staticMembers, 'methods');
    if (!parsedMethods) {
        return [];
    }
    const methodNames = Object.keys(parsedMethods);
    if (methodNames.length === 0) {
        return [];
    }
    return methodNames.map((methodName) => {
        return {
            name: methodName,
            docs: parsedMethods[methodName].docs,
            complexType: parsedMethods[methodName].complexType,
            internal: isInternal(parsedMethods[methodName].docs),
        };
    });
};
//# sourceMappingURL=methods.js.map