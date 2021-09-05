import type { Components, JSX } from '../test-dist/types/components';

interface ShadowDomSlotNested extends Components.ShadowDomSlotNested, HTMLElement {}
export const ShadowDomSlotNested: {
  prototype: ShadowDomSlotNested;
  new (): ShadowDomSlotNested;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
