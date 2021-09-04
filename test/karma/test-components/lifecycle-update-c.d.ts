import type { Components, JSX } from "../test-dist/types/components";

interface LifecycleUpdateC extends Components.LifecycleUpdateC, HTMLElement {}
export const LifecycleUpdateC: {
  prototype: LifecycleUpdateC;
  new (): LifecycleUpdateC;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
