import type { Components, JSX } from "../test-dist/types/components";

interface SvgAttr extends Components.SvgAttr, HTMLElement {}
export const SvgAttr: {
  prototype: SvgAttr;
  new (): SvgAttr;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
