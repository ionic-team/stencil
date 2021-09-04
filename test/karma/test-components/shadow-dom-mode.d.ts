import type { Components, JSX } from "../test-dist/types/components";

interface ShadowDomMode extends Components.ShadowDomMode, HTMLElement {}
export const ShadowDomMode: {
  prototype: ShadowDomMode;
  new (): ShadowDomMode;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
