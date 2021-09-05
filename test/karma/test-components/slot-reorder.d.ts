import type { Components, JSX } from '../test-dist/types/components';

interface SlotReorder extends Components.SlotReorder, HTMLElement {}
export const SlotReorder: {
  prototype: SlotReorder;
  new (): SlotReorder;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
