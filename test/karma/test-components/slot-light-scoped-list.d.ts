import type { Components, JSX } from '../test-dist/types/components';

interface SlotLightScopedList extends Components.SlotLightScopedList, HTMLElement {}
export const SlotLightScopedList: {
  prototype: SlotLightScopedList;
  new (): SlotLightScopedList;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
