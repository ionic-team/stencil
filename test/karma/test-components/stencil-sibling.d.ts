import type { Components, JSX } from '../test-dist/types/components';

interface StencilSibling extends Components.StencilSibling, HTMLElement {}
export const StencilSibling: {
  prototype: StencilSibling;
  new (): StencilSibling;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
