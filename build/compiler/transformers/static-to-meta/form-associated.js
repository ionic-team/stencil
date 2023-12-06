import { getStaticValue } from '../transform-utils';
/**
 * Parse whether a transformed Stencil component is form-associated
 *
 * @param staticMembers class members for the Stencil component of interest
 * @returns whether or not the given component is form-associated
 */
export const parseFormAssociated = (staticMembers) => {
    const isFormAssociated = getStaticValue(staticMembers, 'formAssociated');
    return typeof isFormAssociated === 'boolean' && isFormAssociated;
};
//# sourceMappingURL=form-associated.js.map