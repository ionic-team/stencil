
export interface ComponentWillLoad {
  componentWillLoad: () => Promise<void> | void;
}

export interface ComponentDidLoad {
  componentDidLoad: () => void;
}

export interface ComponentWillUpdate {
  componentWillUpdate: () => Promise<void> | void;
}

export interface ComponentDidUpdate {
  componentDidUpdate: () => void;
}

export interface ComponentDidUnload {
  componentDidUnload: () => void;
}

export interface EventEmitter<T= any> {
  emit: (data?: T) => void;
}

export interface EventListenerEnable {
  (instance: any, eventName: string, enabled: boolean, attachTo?: string|Element, passive?: boolean): void;
}

declare global {
  namespace JSX {
    interface Element {}
    export interface IntrinsicElements {}
  }
  namespace JSXElements {}

  interface HTMLStencilElement extends HTMLElement {
    componentOnReady(): Promise<this>;
    componentOnReady(done: (ele?: this) => void): void;
  }

  interface HTMLAttributes {}
}
