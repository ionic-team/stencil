import type { Components, JSX } from '../test-dist/types/components';

interface JsonBasic extends Components.JsonBasic, HTMLElement {}
export const JsonBasic: {
  prototype: JsonBasic;
  new (): JsonBasic;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
