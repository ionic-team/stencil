import type { Components, JSX } from "../test-dist/types/components";

interface KeyReorder extends Components.KeyReorder, HTMLElement {}
export const KeyReorder: {
  prototype: KeyReorder;
  new (): KeyReorder;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
