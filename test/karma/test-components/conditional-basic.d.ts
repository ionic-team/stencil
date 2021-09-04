import type { Components, JSX } from "../test-dist/types/components";

interface ConditionalBasic extends Components.ConditionalBasic, HTMLElement {}
export const ConditionalBasic: {
  prototype: ConditionalBasic;
  new (): ConditionalBasic;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
