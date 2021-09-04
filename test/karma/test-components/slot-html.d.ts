import type { Components, JSX } from "../test-dist/types/components";

interface SlotHtml extends Components.SlotHtml, HTMLElement {}
export const SlotHtml: {
  prototype: SlotHtml;
  new (): SlotHtml;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
