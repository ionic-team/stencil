import { ListenOptions } from './decorators';


export interface AddEventListener {
  (elm: Element|Document|Window, eventName: string, cb: EventListenerCallback, opts?: ListenOptions): Function;
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
