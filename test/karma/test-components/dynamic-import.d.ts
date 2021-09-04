import type { Components, JSX } from "../test-dist/types/components";

interface DynamicImport extends Components.DynamicImport, HTMLElement {}
export const DynamicImport: {
  prototype: DynamicImport;
  new (): DynamicImport;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
