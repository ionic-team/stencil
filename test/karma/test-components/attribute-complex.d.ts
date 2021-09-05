import type { Components, JSX } from '../test-dist/types/components';

interface AttributeComplex extends Components.AttributeComplex, HTMLElement {}
export const AttributeComplex: {
  prototype: AttributeComplex;
  new (): AttributeComplex;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
