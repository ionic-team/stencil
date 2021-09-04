import type { Components, JSX } from "../test-dist/types/components";

interface Es5AddclassSvg extends Components.Es5AddclassSvg, HTMLElement {}
export const Es5AddclassSvg: {
  prototype: Es5AddclassSvg;
  new (): Es5AddclassSvg;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
