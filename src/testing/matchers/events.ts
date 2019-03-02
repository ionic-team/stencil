import * as d from '../../declarations';
import deepEqual from 'fast-deep-equal';


export function toHaveReceivedEvent(eventSpy: d.EventSpy) {
  if (!eventSpy) {
    throw new Error(`toHaveReceivedEvent event spy is null`);
  }

  if (typeof (eventSpy as any).then === 'function') {
    throw new Error(`event spy must be a resolved value, not a promise, before it can be tested`);
  }

  if (!eventSpy.eventName) {
    throw new Error(`toHaveReceivedEvent did not receive an event spy`);
  }

  const pass = (eventSpy.events.length > 0);

  return {
    message: () => `expected to have ${pass ? 'not ' : ''}called "${eventSpy.eventName}" event`,
    pass: pass,
  };
}

export function toHaveReceivedEventTimes(eventSpy: d.EventSpy, count: number) {
  if (!eventSpy) {
    throw new Error(`toHaveReceivedEventTimes event spy is null`);
  }

  if (typeof (eventSpy as any).then === 'function') {
    throw new Error(`event spy must be a resolved value, not a promise, before it can be tested`);
  }

  if (!eventSpy.eventName) {
    throw new Error(`toHaveReceivedEventTimes did not receive an event spy`);
  }

  const pass = (eventSpy.length === count);

  return {
    message: () => `expected event "${eventSpy.eventName}" to have been called ${count} times, but was called ${eventSpy.events.length} time${eventSpy.events.length > 1 ? 's' : ''}`,
    pass: pass,
  };
}

export function toHaveReceivedEventDetail(eventSpy: d.EventSpy, eventDetail: any) {
  if (!eventSpy) {
    throw new Error(`toHaveReceivedEventDetail event spy is null`);
  }

  if (typeof (eventSpy as any).then === 'function') {
    throw new Error(`event spy must be a resolved value, not a promise, before it can be tested`);
  }

  if (!eventSpy.eventName) {
    throw new Error(`toHaveReceivedEventDetail did not receive an event spy`);
  }

  if (!eventSpy.lastEvent) {
    throw new Error(`event "${eventSpy.eventName}" was not received`);
  }

  const pass = deepEqual(eventSpy.lastEvent.detail, eventDetail);

  expect(eventSpy.lastEvent.detail).toEqual(eventDetail);

  return {
    message: () => `expected event "${eventSpy.eventName}" detail to ${pass ? 'not ' : ''}equal`,
    pass: pass,
  };
}
