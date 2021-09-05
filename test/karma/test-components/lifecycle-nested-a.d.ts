import type { Components, JSX } from '../test-dist/types/components';

interface LifecycleNestedA extends Components.LifecycleNestedA, HTMLElement {}
export const LifecycleNestedA: {
  prototype: LifecycleNestedA;
  new (): LifecycleNestedA;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
