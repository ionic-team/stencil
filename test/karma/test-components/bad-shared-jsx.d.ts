import type { Components, JSX } from '../test-dist/types/components';

interface BadSharedJsx extends Components.BadSharedJsx, HTMLElement {}
export const BadSharedJsx: {
  prototype: BadSharedJsx;
  new (): BadSharedJsx;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
