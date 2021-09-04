import type { Components, JSX } from "../test-dist/types/components";

interface ShadowDomModeRoot extends Components.ShadowDomModeRoot, HTMLElement {}
export const ShadowDomModeRoot: {
  prototype: ShadowDomModeRoot;
  new (): ShadowDomModeRoot;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
