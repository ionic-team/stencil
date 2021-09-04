import type { Components, JSX } from "../test-dist/types/components";

interface ImageImport extends Components.ImageImport, HTMLElement {}
export const ImageImport: {
  prototype: ImageImport;
  new (): ImageImport;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
