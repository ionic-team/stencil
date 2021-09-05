import type { Components, JSX } from '../test-dist/types/components';

interface AttributeHost extends Components.AttributeHost, HTMLElement {}
export const AttributeHost: {
  prototype: AttributeHost;
  new (): AttributeHost;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
