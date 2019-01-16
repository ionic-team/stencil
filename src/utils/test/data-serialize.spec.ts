import { formatComponentConstructorEvent } from '../data-serialize';

describe('formatComponentConstructorEvent', () => {
  it('should initialize ComponentConstructorEvent', () => {
    const event = formatComponentConstructorEvent({
      eventName: 'my-event',
      eventMethodName: 'myMethod',
      eventBubbles: false,
      eventCancelable: false,
      eventComposed: false,
    });
    expect(event).toEqual({
      bubbles: false,
      cancelable: false,
      composed: false,
      method: 'myMethod',
      name: 'my-event'
    });
  });
});
