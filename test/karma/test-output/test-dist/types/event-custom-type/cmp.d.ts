import { EventEmitter } from '../stencil-public-runtime';
import { EventCustomTypeCustomEvent } from '../components';
export interface TestEventDetail {
  value: string;
}
export declare class EventCustomType {
  testEvent: EventEmitter<TestEventDetail>;
  counter: number;
  lastEventValue: TestEventDetail;
  testEventHandler(newValue: EventCustomTypeCustomEvent<TestEventDetail>): void;
  componentDidLoad(): void;
  render(): any;
}
