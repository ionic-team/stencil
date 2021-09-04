import type { Components, JSX } from "../test-dist/types/components";

interface ReparentStyleNoVars extends Components.ReparentStyleNoVars, HTMLElement {}
export const ReparentStyleNoVars: {
  prototype: ReparentStyleNoVars;
  new (): ReparentStyleNoVars;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
