import type { Components, JSX } from '../test-dist/types/components';

interface LifecycleNestedC extends Components.LifecycleNestedC, HTMLElement {}
export const LifecycleNestedC: {
  prototype: LifecycleNestedC;
  new (): LifecycleNestedC;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
