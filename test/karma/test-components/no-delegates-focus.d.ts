import type { Components, JSX } from "../test-dist/types/components";

interface NoDelegatesFocus extends Components.NoDelegatesFocus, HTMLElement {}
export const NoDelegatesFocus: {
  prototype: NoDelegatesFocus;
  new (): NoDelegatesFocus;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
