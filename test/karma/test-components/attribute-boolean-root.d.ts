import type { Components, JSX } from '../test-dist/types/components';

interface AttributeBooleanRoot extends Components.AttributeBooleanRoot, HTMLElement {}
export const AttributeBooleanRoot: {
  prototype: AttributeBooleanRoot;
  new (): AttributeBooleanRoot;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
