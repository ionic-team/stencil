import { getStaticValue } from '../transform-utils';
export const parseStaticElementRef = (staticMembers) => {
    const parsedElementRef = getStaticValue(staticMembers, 'elementRef');
    if (typeof parsedElementRef === 'string') {
        return parsedElementRef;
    }
    return null;
};
//# sourceMappingURL=element-ref.js.map