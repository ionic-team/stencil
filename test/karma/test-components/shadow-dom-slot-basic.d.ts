import type { Components, JSX } from '../test-dist/types/components';

interface ShadowDomSlotBasic extends Components.ShadowDomSlotBasic, HTMLElement {}
export const ShadowDomSlotBasic: {
  prototype: ShadowDomSlotBasic;
  new (): ShadowDomSlotBasic;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
