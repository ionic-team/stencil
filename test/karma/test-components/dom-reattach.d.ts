import type { Components, JSX } from "../test-dist/types/components";

interface DomReattach extends Components.DomReattach, HTMLElement {}
export const DomReattach: {
  prototype: DomReattach;
  new (): DomReattach;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
