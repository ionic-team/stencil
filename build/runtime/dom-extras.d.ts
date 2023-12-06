import type * as d from '../declarations';
export declare const patchPseudoShadowDom: (hostElementPrototype: HTMLElement, descriptorPrototype: d.ComponentRuntimeMeta) => void;
export declare const patchCloneNode: (HostElementPrototype: HTMLElement) => void;
export declare const patchSlotAppendChild: (HostElementPrototype: any) => void;
/**
 * Patches the `prepend` method for a slotted node inside a scoped component.
 *
 * @param HostElementPrototype the `Element` to be patched
 */
export declare const patchSlotPrepend: (HostElementPrototype: HTMLElement) => void;
/**
 * Patches the `append` method for a slotted node inside a scoped component. The patched method uses
 * `appendChild` under-the-hood while creating text nodes for any new children that passed as bare strings.
 *
 * @param HostElementPrototype the `Element` to be patched
 */
export declare const patchSlotAppend: (HostElementPrototype: HTMLElement) => void;
/**
 * Patches the `insertAdjacentHTML` method for a slotted node inside a scoped component. Specifically,
 * we only need to patch the behavior for the specific `beforeend` and `afterbegin` positions so the element
 * gets inserted into the DOM in the correct location.
 *
 * @param HostElementPrototype the `Element` to be patched
 */
export declare const patchSlotInsertAdjacentHTML: (HostElementPrototype: HTMLElement) => void;
/**
 * Patches the `insertAdjacentText` method for a slotted node inside a scoped component. Specifically,
 * we only need to patch the behavior for the specific `beforeend` and `afterbegin` positions so the text node
 * gets inserted into the DOM in the correct location.
 *
 * @param HostElementPrototype the `Element` to be patched
 */
export declare const patchSlotInsertAdjacentText: (HostElementPrototype: HTMLElement) => void;
/**
 * Patches the `insertAdjacentElement` method for a slotted node inside a scoped component. Specifically,
 * we only need to patch the behavior for the specific `beforeend` and `afterbegin` positions so the element
 * gets inserted into the DOM in the correct location.
 *
 * @param HostElementPrototype the `Element` to be patched
 */
export declare const patchSlotInsertAdjacentElement: (HostElementPrototype: HTMLElement) => void;
/**
 * Patches the text content of an unnamed slotted node inside a scoped component
 * @param hostElementPrototype the `Element` to be patched
 * @param cmpMeta component runtime metadata used to determine if the component should be patched or not
 */
export declare const patchTextContent: (hostElementPrototype: HTMLElement, cmpMeta: d.ComponentRuntimeMeta) => void;
export declare const patchChildSlotNodes: (elm: HTMLElement, cmpMeta: d.ComponentRuntimeMeta) => void;
