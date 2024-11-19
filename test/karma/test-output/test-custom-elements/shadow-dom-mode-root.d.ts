import type { Components, JSX } from "../test-dist/types/components";

interface ShadowDomModeRoot extends Components.ShadowDomModeRoot, HTMLElement {}
export const ShadowDomModeRoot: {
  prototype: ShadowDomModeRoot;
  new (): ShadowDomModeRoot;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
