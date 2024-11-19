import type { Components, JSX } from "../test-dist/types/components";

interface ShadowDomSlotBasic extends Components.ShadowDomSlotBasic, HTMLElement {}
export const ShadowDomSlotBasic: {
  prototype: ShadowDomSlotBasic;
  new (): ShadowDomSlotBasic;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
