import type { Components, JSX } from '../test-dist/types/components';

interface LifecycleUnloadB extends Components.LifecycleUnloadB, HTMLElement {}
export const LifecycleUnloadB: {
  prototype: LifecycleUnloadB;
  new (): LifecycleUnloadB;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
