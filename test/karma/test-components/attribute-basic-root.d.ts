import type { Components, JSX } from '../test-dist/types/components';

interface AttributeBasicRoot extends Components.AttributeBasicRoot, HTMLElement {}
export const AttributeBasicRoot: {
  prototype: AttributeBasicRoot;
  new (): AttributeBasicRoot;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
