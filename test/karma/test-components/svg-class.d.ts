import type { Components, JSX } from '../test-dist/types/components';

interface SvgClass extends Components.SvgClass, HTMLElement {}
export const SvgClass: {
  prototype: SvgClass;
  new (): SvgClass;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
