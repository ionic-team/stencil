import type { Components, JSX } from "../test-dist/types/components";

interface CustomEventRoot extends Components.CustomEventRoot, HTMLElement {}
export const CustomEventRoot: {
  prototype: CustomEventRoot;
  new (): CustomEventRoot;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
