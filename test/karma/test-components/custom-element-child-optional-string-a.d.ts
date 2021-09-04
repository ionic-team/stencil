import type { Components, JSX } from "../test-dist/types/components";

interface CustomElementChildOptionalStringA extends Components.CustomElementChildOptionalStringA, HTMLElement {}
export const CustomElementChildOptionalStringA: {
  prototype: CustomElementChildOptionalStringA;
  new (): CustomElementChildOptionalStringA;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
