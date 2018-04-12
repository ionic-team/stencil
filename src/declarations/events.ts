import * as d from './index';


export interface AddEventListener {
  (elm: Element|Document|Window, eventName: string, cb: EventListenerCallback, opts?: d.ListenOptions): Function;
}


export interface EventEmitter<T= any> {
  emit: (data?: T) => void;
}


export interface EventListenerCallback {
  (ev?: any): void;
}


export interface EventEmitterData<T = any> {
  detail?: T;
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
}
