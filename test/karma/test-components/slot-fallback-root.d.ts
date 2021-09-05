import type { Components, JSX } from '../test-dist/types/components';

interface SlotFallbackRoot extends Components.SlotFallbackRoot, HTMLElement {}
export const SlotFallbackRoot: {
  prototype: SlotFallbackRoot;
  new (): SlotFallbackRoot;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
