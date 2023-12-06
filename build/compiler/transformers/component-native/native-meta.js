import { convertValueToLiteral, createStaticGetter } from '../transform-utils';
export const addNativeComponentMeta = (classMembers, cmp) => {
    classMembers.push(createStaticGetter('is', convertValueToLiteral(cmp.tagName)));
};
//# sourceMappingURL=native-meta.js.map