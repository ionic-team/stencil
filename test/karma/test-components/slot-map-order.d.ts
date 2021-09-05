import type { Components, JSX } from '../test-dist/types/components';

interface SlotMapOrder extends Components.SlotMapOrder, HTMLElement {}
export const SlotMapOrder: {
  prototype: SlotMapOrder;
  new (): SlotMapOrder;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
