import type { Components, JSX } from '../test-dist/types/components';

interface DomReattachCloneDeepSlot extends Components.DomReattachCloneDeepSlot, HTMLElement {}
export const DomReattachCloneDeepSlot: {
  prototype: DomReattachCloneDeepSlot;
  new (): DomReattachCloneDeepSlot;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
