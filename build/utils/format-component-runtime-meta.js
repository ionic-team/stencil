export const formatLazyBundleRuntimeMeta = (bundleId, cmps) => {
    return [bundleId, cmps.map((cmp) => formatComponentRuntimeMeta(cmp, true))];
};
/**
 * Transform metadata about a component from the compiler to a compact form for
 * use at runtime.
 *
 * @param compilerMeta component metadata gathered during compilation
 * @param includeMethods include methods in the component's members or not
 * @returns a compact format for component metadata, intended for runtime use
 */
export const formatComponentRuntimeMeta = (compilerMeta, includeMethods) => {
    let flags = 0;
    if (compilerMeta.encapsulation === 'shadow') {
        flags |= 1 /* CMP_FLAGS.shadowDomEncapsulation */;
        if (compilerMeta.shadowDelegatesFocus) {
            flags |= 16 /* CMP_FLAGS.shadowDelegatesFocus */;
        }
    }
    else if (compilerMeta.encapsulation === 'scoped') {
        flags |= 2 /* CMP_FLAGS.scopedCssEncapsulation */;
    }
    if (compilerMeta.formAssociated) {
        flags |= 64 /* CMP_FLAGS.formAssociated */;
    }
    if (compilerMeta.encapsulation !== 'shadow' && compilerMeta.htmlTagNames.includes('slot')) {
        flags |= 4 /* CMP_FLAGS.hasSlotRelocation */;
    }
    if (compilerMeta.hasMode) {
        flags |= 32 /* CMP_FLAGS.hasMode */;
    }
    const members = formatComponentRuntimeMembers(compilerMeta, includeMethods);
    const hostListeners = formatHostListeners(compilerMeta);
    const watchers = formatComponentRuntimeWatchers(compilerMeta);
    return trimFalsy([
        flags,
        compilerMeta.tagName,
        Object.keys(members).length > 0 ? members : undefined,
        hostListeners.length > 0 ? hostListeners : undefined,
        Object.keys(watchers).length > 0 ? watchers : undefined,
    ]);
};
export const stringifyRuntimeData = (data) => {
    const json = JSON.stringify(data);
    if (json.length > 10000) {
        // JSON metadata is big, JSON.parse() is faster
        // https://twitter.com/mathias/status/1143551692732030979
        return `JSON.parse(${JSON.stringify(json)})`;
    }
    return json;
};
/**
 * Transforms Stencil compiler metadata into a {@link d.ComponentCompilerMeta} object.
 * This handles processing any compiler metadata transformed from components' uses of `@Watch()`.
 * The map of watched attributes to their callback(s) will be immediately available
 * to the runtime at bootstrap.
 *
 * @param compilerMeta Component metadata gathered during compilation
 * @returns An object mapping watched attributes to their respective callback(s)
 */
const formatComponentRuntimeWatchers = (compilerMeta) => {
    const watchers = {};
    compilerMeta.watchers.forEach(({ propName, methodName }) => {
        var _a;
        watchers[propName] = [...((_a = watchers[propName]) !== null && _a !== void 0 ? _a : []), methodName];
    });
    return watchers;
};
const formatComponentRuntimeMembers = (compilerMeta, includeMethods = true) => {
    return {
        ...formatPropertiesRuntimeMember(compilerMeta.properties),
        ...formatStatesRuntimeMember(compilerMeta.states),
        ...(includeMethods ? formatMethodsRuntimeMember(compilerMeta.methods) : {}),
    };
};
const formatPropertiesRuntimeMember = (properties) => {
    const runtimeMembers = {};
    properties.forEach((member) => {
        runtimeMembers[member.name] = trimFalsy([
            /**
             * [0] member type
             */
            formatFlags(member),
            formatAttrName(member),
        ]);
    });
    return runtimeMembers;
};
const formatFlags = (compilerProperty) => {
    let type = formatPropType(compilerProperty.type);
    if (compilerProperty.mutable) {
        type |= 1024 /* MEMBER_FLAGS.Mutable */;
    }
    if (compilerProperty.reflect) {
        type |= 512 /* MEMBER_FLAGS.ReflectAttr */;
    }
    return type;
};
const formatAttrName = (compilerProperty) => {
    if (typeof compilerProperty.attribute === 'string') {
        // string attr name means we should observe this attribute
        if (compilerProperty.name === compilerProperty.attribute) {
            // property name and attribute name are the exact same
            // true value means to use the property name for the attribute name
            return undefined;
        }
        // property name and attribute name are not the same
        // so we need to return the actual string value
        // example: "multiWord" !== "multi-word"
        return compilerProperty.attribute;
    }
    // we shouldn't even observe an attribute for this property
    return undefined;
};
const formatPropType = (type) => {
    if (type === 'string') {
        return 1 /* MEMBER_FLAGS.String */;
    }
    if (type === 'number') {
        return 2 /* MEMBER_FLAGS.Number */;
    }
    if (type === 'boolean') {
        return 4 /* MEMBER_FLAGS.Boolean */;
    }
    if (type === 'any') {
        return 8 /* MEMBER_FLAGS.Any */;
    }
    return 16 /* MEMBER_FLAGS.Unknown */;
};
const formatStatesRuntimeMember = (states) => {
    const runtimeMembers = {};
    states.forEach((member) => {
        runtimeMembers[member.name] = [
            32 /* MEMBER_FLAGS.State */,
        ];
    });
    return runtimeMembers;
};
const formatMethodsRuntimeMember = (methods) => {
    const runtimeMembers = {};
    methods.forEach((member) => {
        runtimeMembers[member.name] = [
            64 /* MEMBER_FLAGS.Method */,
        ];
    });
    return runtimeMembers;
};
const formatHostListeners = (compilerMeta) => {
    return compilerMeta.listeners.map((compilerListener) => {
        const hostListener = [
            computeListenerFlags(compilerListener),
            compilerListener.name,
            compilerListener.method,
        ];
        return hostListener;
    });
};
const computeListenerFlags = (listener) => {
    let flags = 0;
    if (listener.capture) {
        flags |= 2 /* LISTENER_FLAGS.Capture */;
    }
    if (listener.passive) {
        flags |= 1 /* LISTENER_FLAGS.Passive */;
    }
    switch (listener.target) {
        case 'document':
            flags |= 4 /* LISTENER_FLAGS.TargetDocument */;
            break;
        case 'window':
            flags |= 8 /* LISTENER_FLAGS.TargetWindow */;
            break;
        case 'body':
            flags |= 16 /* LISTENER_FLAGS.TargetBody */;
            break;
        case 'parent':
            flags |= 32 /* LISTENER_FLAGS.TargetParent */;
            break;
    }
    return flags;
};
const trimFalsy = (data) => {
    const arr = data;
    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i]) {
            break;
        }
        // if falsy, safe to pop()
        arr.pop();
    }
    return arr;
};
//# sourceMappingURL=format-component-runtime-meta.js.map