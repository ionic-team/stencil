import { EventEmitter } from '../stencil-public-runtime';
export declare class LifecycleAsyncC {
  value: string;
  rendered: number;
  lifecycleLoad: EventEmitter;
  lifecycleUpdate: EventEmitter;
  componentWillLoad(): Promise<void>;
  componentDidLoad(): Promise<void>;
  componentWillUpdate(): Promise<void>;
  componentDidUpdate(): Promise<void>;
  render(): any;
}
