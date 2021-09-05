import type { Components, JSX } from '../test-dist/types/components';

interface AttributeBasic extends Components.AttributeBasic, HTMLElement {}
export const AttributeBasic: {
  prototype: AttributeBasic;
  new (): AttributeBasic;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
