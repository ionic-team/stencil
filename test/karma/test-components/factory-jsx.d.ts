import type { Components, JSX } from '../test-dist/types/components';

interface FactoryJsx extends Components.FactoryJsx, HTMLElement {}
export const FactoryJsx: {
  prototype: FactoryJsx;
  new (): FactoryJsx;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
