import type { Components, JSX } from "../test-dist/types/components";

interface ListenJsxRoot extends Components.ListenJsxRoot, HTMLElement {}
export const ListenJsxRoot: {
  prototype: ListenJsxRoot;
  new (): ListenJsxRoot;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
