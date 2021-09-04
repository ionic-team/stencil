import type { Components, JSX } from "../test-dist/types/components";

interface DelegatesFocus extends Components.DelegatesFocus, HTMLElement {}
export const DelegatesFocus: {
  prototype: DelegatesFocus;
  new (): DelegatesFocus;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
