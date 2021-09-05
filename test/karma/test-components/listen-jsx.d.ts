import type { Components, JSX } from '../test-dist/types/components';

interface ListenJsx extends Components.ListenJsx, HTMLElement {}
export const ListenJsx: {
  prototype: ListenJsx;
  new (): ListenJsx;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
