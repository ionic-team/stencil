import ts from 'typescript';
/**
 * Add a getter to a Stencil component class which returns the element's
 * instance at runtime.
 *
 * *Note*: this will modify the `classMembers` param by adding a new element.
 *
 * @param classMembers members of the class in question
 * @param cmp metadata about the stencil component of interest
 */
export const addNativeElementGetter = (classMembers, cmp) => {
    // @Element() element;
    // is transformed into:
    // get element() { return this; }
    if (cmp.elementRef) {
        // Create the getter that will be used in the transformed class declaration
        const getter = ts.factory.createGetAccessorDeclaration(undefined, cmp.elementRef, [], undefined, ts.factory.createBlock([ts.factory.createReturnStatement(ts.factory.createThis())]));
        ts.SyntaxKind.AmpersandToken;
        // Find the index in the class members array that correlates with the element
        // ref identifier we have
        const index = classMembers.findIndex((member) => { var _a; return member.kind === ts.SyntaxKind.PropertyDeclaration && ((_a = member.name) === null || _a === void 0 ? void 0 : _a.escapedText) === cmp.elementRef; });
        // Index should never not be a valid integer, but we'll be safe just in case.
        // If the index is valid, we'll overwrite the existing class member with the getter
        // so we don't create multiple members with the same identifier
        if (index >= 0) {
            classMembers[index] = getter;
        }
        else {
            classMembers.push(getter);
        }
    }
};
//# sourceMappingURL=native-element-getter.js.map