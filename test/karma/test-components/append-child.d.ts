import type { Components, JSX } from "../test-dist/types/components";

interface AppendChild extends Components.AppendChild, HTMLElement {}
export const AppendChild: {
  prototype: AppendChild;
  new (): AppendChild;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
