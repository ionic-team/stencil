import type { Components, JSX } from '../test-dist/types/components';

interface SlotArrayComplexRoot extends Components.SlotArrayComplexRoot, HTMLElement {}
export const SlotArrayComplexRoot: {
  prototype: SlotArrayComplexRoot;
  new (): SlotArrayComplexRoot;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
