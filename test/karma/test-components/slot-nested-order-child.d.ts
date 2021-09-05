import type { Components, JSX } from '../test-dist/types/components';

interface SlotNestedOrderChild extends Components.SlotNestedOrderChild, HTMLElement {}
export const SlotNestedOrderChild: {
  prototype: SlotNestedOrderChild;
  new (): SlotNestedOrderChild;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
