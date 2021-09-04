import type { Components, JSX } from "../test-dist/types/components";

interface LifecycleBasicC extends Components.LifecycleBasicC, HTMLElement {}
export const LifecycleBasicC: {
  prototype: LifecycleBasicC;
  new (): LifecycleBasicC;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
