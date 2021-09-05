import type { Components, JSX } from '../test-dist/types/components';

interface SlotDynamicShadowList extends Components.SlotDynamicShadowList, HTMLElement {}
export const SlotDynamicShadowList: {
  prototype: SlotDynamicShadowList;
  new (): SlotDynamicShadowList;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
