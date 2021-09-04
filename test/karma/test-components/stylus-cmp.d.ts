import type { Components, JSX } from "../test-dist/types/components";

interface StylusCmp extends Components.StylusCmp, HTMLElement {}
export const StylusCmp: {
  prototype: StylusCmp;
  new (): StylusCmp;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
