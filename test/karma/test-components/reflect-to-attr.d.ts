import type { Components, JSX } from "../test-dist/types/components";

interface ReflectToAttr extends Components.ReflectToAttr, HTMLElement {}
export const ReflectToAttr: {
  prototype: ReflectToAttr;
  new (): ReflectToAttr;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
