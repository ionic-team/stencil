import type { Components, JSX } from "../test-dist/types/components";

interface CssCmp extends Components.CssCmp, HTMLElement {}
export const CssCmp: {
  prototype: CssCmp;
  new (): CssCmp;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
