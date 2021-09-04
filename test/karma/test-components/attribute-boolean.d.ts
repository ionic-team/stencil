import type { Components, JSX } from "../test-dist/types/components";

interface AttributeBoolean extends Components.AttributeBoolean, HTMLElement {}
export const AttributeBoolean: {
  prototype: AttributeBoolean;
  new (): AttributeBoolean;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
