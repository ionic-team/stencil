import type { Components, JSX } from "../test-dist/types/components";

interface LifecycleUpdateB extends Components.LifecycleUpdateB, HTMLElement {}
export const LifecycleUpdateB: {
  prototype: LifecycleUpdateB;
  new (): LifecycleUpdateB;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
