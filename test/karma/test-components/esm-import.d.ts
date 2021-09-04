import type { Components, JSX } from "../test-dist/types/components";

interface EsmImport extends Components.EsmImport, HTMLElement {}
export const EsmImport: {
  prototype: EsmImport;
  new (): EsmImport;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
