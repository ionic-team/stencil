import type { Components, JSX } from "../test-dist/types/components";

interface KeyReorderRoot extends Components.KeyReorderRoot, HTMLElement {}
export const KeyReorderRoot: {
  prototype: KeyReorderRoot;
  new (): KeyReorderRoot;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
