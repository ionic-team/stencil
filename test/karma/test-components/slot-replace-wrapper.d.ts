import type { Components, JSX } from '../test-dist/types/components';

interface SlotReplaceWrapper extends Components.SlotReplaceWrapper, HTMLElement {}
export const SlotReplaceWrapper: {
  prototype: SlotReplaceWrapper;
  new (): SlotReplaceWrapper;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
