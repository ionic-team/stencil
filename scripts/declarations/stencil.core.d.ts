
export interface EventEmitter<T= any> {
  emit: (data?: T) => void;
}

export interface EventListenerEnable {
  (instance: any, eventName: string, enabled: boolean, attachTo?: string|Element, passive?: boolean): void;
}
