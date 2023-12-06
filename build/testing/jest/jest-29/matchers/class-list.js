export function toHaveClass(elm, expectClassName) {
    if (!elm) {
        throw new Error(`expect toHaveClass value is null`);
    }
    if (typeof elm.then === 'function') {
        throw new Error(`element must be a resolved value, not a promise, before it can be tested`);
    }
    if (elm.nodeType !== 1) {
        throw new Error(`expect toHaveClass value is not an element`);
    }
    const pass = elm.classList.contains(expectClassName);
    return {
        message: () => `expected to ${pass ? 'not ' : ''}have css class "${expectClassName}"`,
        pass: pass,
    };
}
export function toHaveClasses(elm, expectClassNames) {
    if (!elm) {
        throw new Error(`expect toHaveClasses value is null`);
    }
    if (typeof elm.then === 'function') {
        throw new Error(`element must be a resolved value, not a promise, before it can be tested`);
    }
    if (elm.nodeType !== 1) {
        throw new Error(`expect toHaveClasses value is not an element`);
    }
    const pass = expectClassNames.every((expectClassName) => {
        return elm.classList.contains(expectClassName);
    });
    return {
        message: () => `expected to ${pass ? 'not ' : ''}have css classes "${expectClassNames.join(' ')}", but className is "${elm.className}"`,
        pass: pass,
    };
}
export function toMatchClasses(elm, expectClassNames) {
    let { pass } = toHaveClasses(elm, expectClassNames);
    if (pass) {
        pass = expectClassNames.length === elm.classList.length;
    }
    return {
        message: () => `expected to ${pass ? 'not ' : ''}match css classes "${expectClassNames.join(' ')}", but className is "${elm.className}"`,
        pass: pass,
    };
}
//# sourceMappingURL=class-list.js.map