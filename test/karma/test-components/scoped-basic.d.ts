import type { Components, JSX } from "../test-dist/types/components";

interface ScopedBasic extends Components.ScopedBasic, HTMLElement {}
export const ScopedBasic: {
  prototype: ScopedBasic;
  new (): ScopedBasic;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
