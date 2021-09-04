import type { Components, JSX } from "../test-dist/types/components";

interface LifecycleBasicB extends Components.LifecycleBasicB, HTMLElement {}
export const LifecycleBasicB: {
  prototype: LifecycleBasicB;
  new (): LifecycleBasicB;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
