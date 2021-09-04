import type { Components, JSX } from "../test-dist/types/components";

interface LifecycleAsyncB extends Components.LifecycleAsyncB, HTMLElement {}
export const LifecycleAsyncB: {
  prototype: LifecycleAsyncB;
  new (): LifecycleAsyncB;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
