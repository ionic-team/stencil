import type { Components, JSX } from "../test-dist/types/components";

interface LifecycleBasicA extends Components.LifecycleBasicA, HTMLElement {}
export const LifecycleBasicA: {
  prototype: LifecycleBasicA;
  new (): LifecycleBasicA;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
