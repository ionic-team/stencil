import type { Components, JSX } from "../test-dist/types/components";

interface ConditionalRerender extends Components.ConditionalRerender, HTMLElement {}
export const ConditionalRerender: {
  prototype: ConditionalRerender;
  new (): ConditionalRerender;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
