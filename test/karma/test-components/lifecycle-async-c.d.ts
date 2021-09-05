import type { Components, JSX } from '../test-dist/types/components';

interface LifecycleAsyncC extends Components.LifecycleAsyncC, HTMLElement {}
export const LifecycleAsyncC: {
  prototype: LifecycleAsyncC;
  new (): LifecycleAsyncC;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
