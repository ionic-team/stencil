import type { Components, JSX } from '../test-dist/types/components';

interface ScopedBasicRoot extends Components.ScopedBasicRoot, HTMLElement {}
export const ScopedBasicRoot: {
  prototype: ScopedBasicRoot;
  new (): ScopedBasicRoot;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
