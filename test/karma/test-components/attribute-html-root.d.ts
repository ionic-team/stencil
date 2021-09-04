import type { Components, JSX } from "../test-dist/types/components";

interface AttributeHtmlRoot extends Components.AttributeHtmlRoot, HTMLElement {}
export const AttributeHtmlRoot: {
  prototype: AttributeHtmlRoot;
  new (): AttributeHtmlRoot;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
