import type { Components, JSX } from "../test-dist/types/components";

interface DynamicCssVariable extends Components.DynamicCssVariable, HTMLElement {}
export const DynamicCssVariable: {
  prototype: DynamicCssVariable;
  new (): DynamicCssVariable;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
