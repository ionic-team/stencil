import type { Components, JSX } from "../test-dist/types/components";

interface ShadowDomBasic extends Components.ShadowDomBasic, HTMLElement {}
export const ShadowDomBasic: {
  prototype: ShadowDomBasic;
  new (): ShadowDomBasic;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
