import { EventEmitter } from '../stencil-public-runtime';
export declare class LifecycleBasicB {
  value: string;
  rendered: number;
  lifecycleLoad: EventEmitter;
  lifecycleUpdate: EventEmitter;
  componentWillLoad(): void;
  componentDidLoad(): void;
  componentWillUpdate(): void;
  componentDidUpdate(): void;
  render(): any;
}
