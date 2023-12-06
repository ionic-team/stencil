import { formatComponentRuntimeMeta } from '@utils';
import { addStaticStyleGetterWithinClass } from '../add-static-style';
import { convertValueToLiteral, createStaticGetter } from '../transform-utils';
export const addHydrateRuntimeCmpMeta = (classMembers, cmp) => {
    const compactMeta = formatComponentRuntimeMeta(cmp, true);
    const cmpMeta = {
        $flags$: compactMeta[0],
        $tagName$: compactMeta[1],
        $members$: compactMeta[2],
        $listeners$: compactMeta[3],
        $lazyBundleId$: fakeBundleIds(cmp),
        $attrsToReflect$: getHydrateAttrsToReflect(cmp),
    };
    // We always need shadow-dom shim in hydrate runtime
    if (cmpMeta.$flags$ & 1 /* CMP_FLAGS.shadowDomEncapsulation */) {
        // TODO(STENCIL-854): Remove code related to legacy shadowDomShim field
        cmpMeta.$flags$ |= 8 /* CMP_FLAGS.needsShadowDomShim */;
    }
    const staticMember = createStaticGetter('cmpMeta', convertValueToLiteral(cmpMeta));
    const commentOriginalSelector = cmp.encapsulation === 'shadow';
    addStaticStyleGetterWithinClass(classMembers, cmp, commentOriginalSelector);
    classMembers.push(staticMember);
};
const fakeBundleIds = (_cmp) => {
    return '-';
};
const getHydrateAttrsToReflect = (cmp) => {
    return cmp.properties.reduce((attrs, prop) => {
        if (prop.reflect) {
            attrs.push([prop.name, prop.attribute]);
        }
        return attrs;
    }, []);
};
//# sourceMappingURL=hydrate-runtime-cmp-meta.js.map