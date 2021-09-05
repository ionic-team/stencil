import type { Components, JSX } from '../test-dist/types/components';

interface SlotDynamicScopedList extends Components.SlotDynamicScopedList, HTMLElement {}
export const SlotDynamicScopedList: {
  prototype: SlotDynamicScopedList;
  new (): SlotDynamicScopedList;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
