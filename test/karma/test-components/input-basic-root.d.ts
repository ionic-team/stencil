import type { Components, JSX } from "../test-dist/types/components";

interface InputBasicRoot extends Components.InputBasicRoot, HTMLElement {}
export const InputBasicRoot: {
  prototype: InputBasicRoot;
  new (): InputBasicRoot;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
