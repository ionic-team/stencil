import type { Components, JSX } from "../test-dist/types/components";

interface AppendChild extends Components.AppendChild, HTMLElement {}
export const AppendChild: {
  prototype: AppendChild;
  new (): AppendChild;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
