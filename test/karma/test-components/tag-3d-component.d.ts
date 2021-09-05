import type { Components, JSX } from '../test-dist/types/components';

interface Tag3dComponent extends Components.Tag3dComponent, HTMLElement {}
export const Tag3dComponent: {
  prototype: Tag3dComponent;
  new (): Tag3dComponent;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
