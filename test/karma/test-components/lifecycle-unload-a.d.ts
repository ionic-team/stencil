import type { Components, JSX } from "../test-dist/types/components";

interface LifecycleUnloadA extends Components.LifecycleUnloadA, HTMLElement {}
export const LifecycleUnloadA: {
  prototype: LifecycleUnloadA;
  new (): LifecycleUnloadA;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
