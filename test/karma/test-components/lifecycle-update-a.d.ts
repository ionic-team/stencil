import type { Components, JSX } from '../test-dist/types/components';

interface LifecycleUpdateA extends Components.LifecycleUpdateA, HTMLElement {}
export const LifecycleUpdateA: {
  prototype: LifecycleUpdateA;
  new (): LifecycleUpdateA;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
