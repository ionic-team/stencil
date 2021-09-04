import type { Components, JSX } from "../test-dist/types/components";

interface ShadowDomArrayRoot extends Components.ShadowDomArrayRoot, HTMLElement {}
export const ShadowDomArrayRoot: {
  prototype: ShadowDomArrayRoot;
  new (): ShadowDomArrayRoot;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
