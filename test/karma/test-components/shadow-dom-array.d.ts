import type { Components, JSX } from '../test-dist/types/components';

interface ShadowDomArray extends Components.ShadowDomArray, HTMLElement {}
export const ShadowDomArray: {
  prototype: ShadowDomArray;
  new (): ShadowDomArray;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
