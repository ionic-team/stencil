/**
 * Production setAccessor() function based on Preact by
 * Jason Miller (@developit)
 * Licensed under the MIT License
 * https://github.com/developit/preact/blob/master/LICENSE
 *
 * Modified for Stencil's compiler and vdom
 */
/**
 * When running a VDom render set properties present on a VDom node onto the
 * corresponding HTML element.
 *
 * Note that this function has special functionality for the `class`,
 * `style`, `key`, and `ref` attributes, as well as event handlers (like
 * `onClick`, etc). All others are just passed through as-is.
 *
 * @param elm the HTMLElement onto which attributes should be set
 * @param memberName the name of the attribute to set
 * @param oldValue the old value for the attribute
 * @param newValue the new value for the attribute
 * @param isSvg whether we're in an svg context or not
 * @param flags bitflags for Vdom variables
 */
export declare const setAccessor: (elm: HTMLElement, memberName: string, oldValue: any, newValue: any, isSvg: boolean, flags: number) => void;
