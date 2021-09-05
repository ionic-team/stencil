import type { Components, JSX } from '../test-dist/types/components';

interface ShadowDomBasicRoot extends Components.ShadowDomBasicRoot, HTMLElement {}
export const ShadowDomBasicRoot: {
  prototype: ShadowDomBasicRoot;
  new (): ShadowDomBasicRoot;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
