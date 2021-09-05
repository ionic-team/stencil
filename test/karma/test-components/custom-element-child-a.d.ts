import type { Components, JSX } from '../test-dist/types/components';

interface CustomElementChildA extends Components.CustomElementChildA, HTMLElement {}
export const CustomElementChildA: {
  prototype: CustomElementChildA;
  new (): CustomElementChildA;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
