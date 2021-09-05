import type { Components, JSX } from '../test-dist/types/components';

interface ExternalImportB extends Components.ExternalImportB, HTMLElement {}
export const ExternalImportB: {
  prototype: ExternalImportB;
  new (): ExternalImportB;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
