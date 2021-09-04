import type { Components, JSX } from "../test-dist/types/components";

interface ReparentStyleWithVars extends Components.ReparentStyleWithVars, HTMLElement {}
export const ReparentStyleWithVars: {
  prototype: ReparentStyleWithVars;
  new (): ReparentStyleWithVars;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
