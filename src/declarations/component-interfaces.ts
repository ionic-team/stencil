/**
 * This file gets copied to all distributions of stencil component collections.
 * - no imports
 */

export interface ComponentWillLoad {
  /**
   * The component is about to load and it has not
   * rendered yet.
   *
   * This is the best place to make any data updates
   * before the first render.
   *
   * componentWillLoad will only be called once.
   */
  componentWillLoad: () => Promise<void> | void;
}

export interface ComponentDidLoad {
  /**
   * The component has loaded and has already rendered.
   *
   * Updating data in this method will cause the
   * component to re-render.
   *
   * componentDidLoad will only be called once.
   */
  componentDidLoad: () => void;
}

export interface ComponentWillUpdate {
  /**
   * The component is about to update and re-render.
   *
   * Called multiple times throughout the life of
   * the component as it updates.
   *
   * componentWillUpdate is not called on the first render.
   */
  componentWillUpdate: () => Promise<void> | void;
}

export interface ComponentDidUpdate {
  /**
   * The component has just re-rendered.
   *
   * Called multiple times throughout the life of
   * the component as it updates.
   *
   * componentWillUpdate is not called on the
   * first render.
   */
  componentDidUpdate: () => void;
}

export interface ComponentDidUnload {
  /**
   * The component did unload and the element
   * will be destroyed.
   */
  componentDidUnload: () => void;
}

export interface ComponentInstance {
  /**
   * The component is about to load and it has not
   * rendered yet.
   *
   * This is the best place to make any data updates
   * before the first render.
   *
   * componentWillLoad will only be called once.
   */
  componentWillLoad?: () => Promise<void> | void;

  /**
   * The component has loaded and has already rendered.
   *
   * Updating data in this method will cause the
   * component to re-render.
   *
   * componentDidLoad will only be called once.
   */
  componentDidLoad?: () => void;

  /**
   * The component is about to update and re-render.
   *
   * Called multiple times throughout the life of
   * the component as it updates.
   *
   * componentWillUpdate is not called on the first render.
   */
  componentWillUpdate?: () => Promise<void> | void;

  /**
   * The component has just re-rendered.
   *
   * Called multiple times throughout the life of
   * the component as it updates.
   *
   * componentWillUpdate is not called on the
   * first render.
   */
  componentDidUpdate?: () => void;

  /**
   * The component did unload and the element
   * will be destroyed.
   */
  componentDidUnload?: () => void;

  render?: () => any;

  /**
   * Used to dynamically set host element attributes.
   * Should be placed directly above render()
   */
  hostData?: () => {
    class?: {[className: string]: boolean};
    style?: any;
    [attrName: string]: any;
  };

  [memberName: string]: any;
}


/**
 * General types important to applications using stencil built components
 */
export interface EventEmitter<T= any> {
  emit: (data?: T) => CustomEvent<T>;
}

export interface EventListenerEnable {
  (instance: any, eventName: string, enabled: boolean, attachTo?: string|Element, passive?: boolean): void;
}

export interface QueueApi {
  tick: (cb: RafCallback) => void;
  read: (cb: RafCallback) => void;
  write: (cb: RafCallback) => void;
  clear?: () => void;
  flush?: (cb?: () => void) => void;
}

export interface RafCallback {
  (timeStamp: number): void;
}

export interface HTMLStencilElement extends HTMLElement {
  componentOnReady(): Promise<this>;
  forceUpdate(): void;
}
