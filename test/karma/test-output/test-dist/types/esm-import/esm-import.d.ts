import { EventEmitter } from '../stencil-public-runtime';
export declare class EsmImport {
  el: any;
  propVal: number;
  isReady: string;
  stateVal?: string;
  listenVal: number;
  someEventInc: number;
  someEvent: EventEmitter;
  testClick(): void;
  someMethod(): Promise<void>;
  testMethod(): void;
  componentWillLoad(): void;
  componentDidLoad(): void;
  render(): any;
}
