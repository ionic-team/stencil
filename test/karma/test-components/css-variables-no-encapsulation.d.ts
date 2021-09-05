import type { Components, JSX } from '../test-dist/types/components';

interface CssVariablesNoEncapsulation extends Components.CssVariablesNoEncapsulation, HTMLElement {}
export const CssVariablesNoEncapsulation: {
  prototype: CssVariablesNoEncapsulation;
  new (): CssVariablesNoEncapsulation;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
