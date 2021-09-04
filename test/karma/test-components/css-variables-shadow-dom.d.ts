import type { Components, JSX } from "../test-dist/types/components";

interface CssVariablesShadowDom extends Components.CssVariablesShadowDom, HTMLElement {}
export const CssVariablesShadowDom: {
  prototype: CssVariablesShadowDom;
  new (): CssVariablesShadowDom;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
