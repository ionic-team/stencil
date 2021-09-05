import type { Components, JSX } from '../test-dist/types/components';

interface ShadowDomSlotNestedRoot extends Components.ShadowDomSlotNestedRoot, HTMLElement {}
export const ShadowDomSlotNestedRoot: {
  prototype: ShadowDomSlotNestedRoot;
  new (): ShadowDomSlotNestedRoot;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
