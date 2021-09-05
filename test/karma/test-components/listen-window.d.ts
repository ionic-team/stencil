import type { Components, JSX } from '../test-dist/types/components';

interface ListenWindow extends Components.ListenWindow, HTMLElement {}
export const ListenWindow: {
  prototype: ListenWindow;
  new (): ListenWindow;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
