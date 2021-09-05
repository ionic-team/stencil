import type { Components, JSX } from '../test-dist/types/components';

interface ExternalImportA extends Components.ExternalImportA, HTMLElement {}
export const ExternalImportA: {
  prototype: ExternalImportA;
  new (): ExternalImportA;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
