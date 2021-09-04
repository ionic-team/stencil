import type { Components, JSX } from "../test-dist/types/components";

interface ExternalImportC extends Components.ExternalImportC, HTMLElement {}
export const ExternalImportC: {
  prototype: ExternalImportC;
  new (): ExternalImportC;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
