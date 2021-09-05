import type { Components, JSX } from '../test-dist/types/components';

interface DomReattachClone extends Components.DomReattachClone, HTMLElement {}
export const DomReattachClone: {
  prototype: DomReattachClone;
  new (): DomReattachClone;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
