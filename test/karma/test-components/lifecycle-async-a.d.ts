import type { Components, JSX } from "../test-dist/types/components";

interface LifecycleAsyncA extends Components.LifecycleAsyncA, HTMLElement {}
export const LifecycleAsyncA: {
  prototype: LifecycleAsyncA;
  new (): LifecycleAsyncA;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
