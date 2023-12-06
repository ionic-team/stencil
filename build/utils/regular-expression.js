/**
 * Utility function that will escape all regular expression special characters in a string.
 *
 * @param text The string potentially containing special characters.
 * @returns The string with all special characters escaped.
 */
export const escapeRegExpSpecialCharacters = (text) => {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
//# sourceMappingURL=regular-expression.js.map