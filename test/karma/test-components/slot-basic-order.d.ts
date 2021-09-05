import type { Components, JSX } from '../test-dist/types/components';

interface SlotBasicOrder extends Components.SlotBasicOrder, HTMLElement {}
export const SlotBasicOrder: {
  prototype: SlotBasicOrder;
  new (): SlotBasicOrder;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
