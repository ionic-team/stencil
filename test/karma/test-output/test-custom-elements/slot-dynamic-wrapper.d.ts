import type { Components, JSX } from "../test-dist/types/components";

interface SlotDynamicWrapper extends Components.SlotDynamicWrapper, HTMLElement {}
export const SlotDynamicWrapper: {
  prototype: SlotDynamicWrapper;
  new (): SlotDynamicWrapper;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
