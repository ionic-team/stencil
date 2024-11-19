import type { Components, JSX } from "../test-dist/types/components";

interface EventCustomType extends Components.EventCustomType, HTMLElement {}
export const EventCustomType: {
  prototype: EventCustomType;
  new (): EventCustomType;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
