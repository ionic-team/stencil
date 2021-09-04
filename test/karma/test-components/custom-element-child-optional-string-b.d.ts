import type { Components, JSX } from "../test-dist/types/components";

interface CustomElementChildOptionalStringB extends Components.CustomElementChildOptionalStringB, HTMLElement {}
export const CustomElementChildOptionalStringB: {
  prototype: CustomElementChildOptionalStringB;
  new (): CustomElementChildOptionalStringB;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
