import type { Components, JSX } from '../test-dist/types/components';

interface LifecycleUnloadRoot extends Components.LifecycleUnloadRoot, HTMLElement {}
export const LifecycleUnloadRoot: {
  prototype: LifecycleUnloadRoot;
  new (): LifecycleUnloadRoot;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
