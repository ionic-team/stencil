import type { Components, JSX } from '../test-dist/types/components';

interface StaticStyles extends Components.StaticStyles, HTMLElement {}
export const StaticStyles: {
  prototype: StaticStyles;
  new (): StaticStyles;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
