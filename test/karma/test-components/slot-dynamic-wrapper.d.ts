import type { Components, JSX } from '../test-dist/types/components';

interface SlotDynamicWrapper extends Components.SlotDynamicWrapper, HTMLElement {}
export const SlotDynamicWrapper: {
  prototype: SlotDynamicWrapper;
  new (): SlotDynamicWrapper;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
