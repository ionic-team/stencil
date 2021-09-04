import type { Components, JSX } from "../test-dist/types/components";

interface CustomElementRoot extends Components.CustomElementRoot, HTMLElement {}
export const CustomElementRoot: {
  prototype: CustomElementRoot;
  new (): CustomElementRoot;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
