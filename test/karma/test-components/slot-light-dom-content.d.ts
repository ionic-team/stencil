import type { Components, JSX } from "../test-dist/types/components";

interface SlotLightDomContent extends Components.SlotLightDomContent, HTMLElement {}
export const SlotLightDomContent: {
  prototype: SlotLightDomContent;
  new (): SlotLightDomContent;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
