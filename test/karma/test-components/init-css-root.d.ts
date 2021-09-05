import type { Components, JSX } from '../test-dist/types/components';

interface InitCssRoot extends Components.InitCssRoot, HTMLElement {}
export const InitCssRoot: {
  prototype: InitCssRoot;
  new (): InitCssRoot;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
