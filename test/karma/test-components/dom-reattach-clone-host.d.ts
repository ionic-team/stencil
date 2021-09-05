import type { Components, JSX } from '../test-dist/types/components';

interface DomReattachCloneHost extends Components.DomReattachCloneHost, HTMLElement {}
export const DomReattachCloneHost: {
  prototype: DomReattachCloneHost;
  new (): DomReattachCloneHost;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
