import type { Components, JSX } from "../test-dist/types/components";

interface LifecycleNestedB extends Components.LifecycleNestedB, HTMLElement {}
export const LifecycleNestedB: {
  prototype: LifecycleNestedB;
  new (): LifecycleNestedB;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
