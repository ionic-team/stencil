import type { Components, JSX } from "../test-dist/types/components";

interface SvgAttr extends Components.SvgAttr, HTMLElement {}
export const SvgAttr: {
  prototype: SvgAttr;
  new (): SvgAttr;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
