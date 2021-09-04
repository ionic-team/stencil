import type { Components, JSX } from "../test-dist/types/components";

interface LessCmp extends Components.LessCmp, HTMLElement {}
export const LessCmp: {
  prototype: LessCmp;
  new (): LessCmp;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
