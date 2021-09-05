import type { Components, JSX } from '../test-dist/types/components';

interface SlottedCss extends Components.SlottedCss, HTMLElement {}
export const SlottedCss: {
  prototype: SlottedCss;
  new (): SlottedCss;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
