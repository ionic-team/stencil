import type { Components, JSX } from '../test-dist/types/components';

interface ListenReattach extends Components.ListenReattach, HTMLElement {}
export const ListenReattach: {
  prototype: ListenReattach;
  new (): ListenReattach;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
