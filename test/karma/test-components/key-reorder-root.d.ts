import type { Components, JSX } from "../test-dist/types/components";

interface KeyReorderRoot extends Components.KeyReorderRoot, HTMLElement {}
export const KeyReorderRoot: {
  prototype: KeyReorderRoot;
  new (): KeyReorderRoot;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
