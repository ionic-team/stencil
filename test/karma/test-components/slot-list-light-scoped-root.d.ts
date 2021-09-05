import type { Components, JSX } from '../test-dist/types/components';

interface SlotListLightScopedRoot extends Components.SlotListLightScopedRoot, HTMLElement {}
export const SlotListLightScopedRoot: {
  prototype: SlotListLightScopedRoot;
  new (): SlotListLightScopedRoot;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
