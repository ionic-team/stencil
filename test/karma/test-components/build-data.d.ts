import type { Components, JSX } from '../test-dist/types/components';

interface BuildData extends Components.BuildData, HTMLElement {}
export const BuildData: {
  prototype: BuildData;
  new (): BuildData;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
