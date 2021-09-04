import type { Components, JSX } from "../test-dist/types/components";

interface CustomElementNestedChild extends Components.CustomElementNestedChild, HTMLElement {}
export const CustomElementNestedChild: {
  prototype: CustomElementNestedChild;
  new (): CustomElementNestedChild;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
