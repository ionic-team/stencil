import type { Components, JSX } from "../test-dist/types/components";

interface ConditionalRerenderRoot extends Components.ConditionalRerenderRoot, HTMLElement {}
export const ConditionalRerenderRoot: {
  prototype: ConditionalRerenderRoot;
  new (): ConditionalRerenderRoot;
};
export const defineCustomElement: (tagRename?: (origTagName: string) => string) => void;
