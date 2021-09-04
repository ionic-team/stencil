import type { Components, JSX } from "../test-dist/types/components";

interface SassCmp extends Components.SassCmp, HTMLElement {}
export const SassCmp: {
  prototype: SassCmp;
  new (): SassCmp;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
