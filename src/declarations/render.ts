import { HostElement } from './host-element';


/**
 * Generic node that represents all of the
 * different types of nodes we'd see when rendering
 */
export interface RenderNode extends HostElement {

  /**
   * Shadow root's host
   */
  host?: Element;

  /**
   * Is Content Reference Node:
   * This node is a content reference node.
   */
  ['s-cn']?: boolean;

  /**
   * Is a slot reference node:
   * This is a node that represents where a slots
   * was originally located.
   */
  ['s-sr']?: boolean;

  /**
   * Slot name
   */
  ['s-sn']?: string;

  /**
   * Host element tag name:
   * The tag name of the host element that this
   * node was created in.
   */
  ['s-hn']?: string;

  /**
   * Original Location Reference:
   * A reference pointing to the comment
   * which represents the original location
   * before it was moved to its slot.
   */
  ['s-ol']?: RenderNode;

  /**
   * Node reference:
   * This is a reference for a original location node
   * back to the node that's been moved around.
   */
  ['s-nr']?: RenderNode;

  /**
   * Scope Id
   */
  ['s-si']?: string;

  /**
   * Host Id (hydrate only)
   */
  ['s-host-id']?: number;

  /**
   * Node Id (hydrate only)
   */
  ['s-node-id']?: number;

  /**
   * Used to know the components encapsulation.
   * empty "" for shadow, "c" from scoped
   */
  ['s-en']?: '' /*shadow*/ | 'c' /*scoped*/;
}
