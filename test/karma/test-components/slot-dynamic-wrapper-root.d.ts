import type { Components, JSX } from '../test-dist/types/components';

interface SlotDynamicWrapperRoot extends Components.SlotDynamicWrapperRoot, HTMLElement {}
export const SlotDynamicWrapperRoot: {
  prototype: SlotDynamicWrapperRoot;
  new (): SlotDynamicWrapperRoot;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
