import * as d from '../declarations';
import { parseFragment } from './parse-html';
import { serialize } from './mock-doc/serialize-node';
import deepEqual from 'fast-deep-equal';
import { NODE_TYPES } from './mock-doc/constants';


export function toEqualHtml(input: string | HTMLElement | ShadowRoot, shouldEqual: string) {
  if (input == null) {
    throw new Error(`expect toEqualHtml value is null`);
  }

  let serializeA: string;

  if ((input as HTMLElement).nodeType === NODE_TYPES.ELEMENT_NODE) {
    serializeA = serialize((input as any), {
      format: 'html',
      pretty: true,
      excludeRoot: false
    });

  } else if ((input as HTMLElement).nodeType === NODE_TYPES.DOCUMENT_FRAGMENT_NODE) {
    serializeA = serialize((input as any), {
      format: 'html',
      pretty: true,
      excludeRoot: true,
      excludeTags: ['style'],
      excludeTagContent: ['style']
    });

  } else if (typeof input === 'string') {
    const parseA = parseFragment(input);
    serializeA = serialize(parseA, {
      format: 'html',
      pretty: true,
      excludeRoot: true
    });

  } else {
    throw new Error(`expect toEqualHtml value should be an element, shadow root or string`);
  }

  const parseB = parseFragment(shouldEqual);

  const serializeB = serialize(parseB, {
    format: 'html',
    pretty: true
  });

  if (serializeA !== serializeB) {
    expect(serializeA).toBe(serializeB);
    return {
      message: () => 'HTML does not match',
      pass: false,
    };
  }

  return {
    message: () => 'expect HTML to match',
    pass: true,
  };
}

export function toEqualText(input: HTMLElement | string, expectTextContent: string) {
  if (!input) {
    throw new Error(`expect toEqualText value is null`);
  }

  if (typeof (input as any).then === 'function') {
    throw new Error(`element must be a resolved value, not a promise, before it can be tested`);
  }

  let textContent: string;

  if ((input as HTMLElement).nodeType === NODE_TYPES.ELEMENT_NODE) {
    textContent = (input as HTMLElement).textContent.replace(/\s\s+/g, ' ').trim();

  } else if (input != null) {
    textContent = String(input).replace(/\s\s+/g, ' ').trim();
  }

  if (typeof expectTextContent === 'string') {
    expectTextContent = expectTextContent.replace(/\s\s+/g, ' ').trim();
  }

  const pass = (textContent === expectTextContent);

  return {
    message: () => `expected textContent "${expectTextContent}" to ${pass ? 'not ' : ''}equal "${textContent}"`,
    pass: pass,
  };
}

export function toHaveAttribute(elm: HTMLElement, expectAttrName: string) {
  if (!elm) {
    throw new Error(`expect toHaveAttribute value is null`);
  }

  if (typeof (elm as any).then === 'function') {
    throw new Error(`element must be a resolved value, not a promise, before it can be tested`);
  }

  if (elm.nodeType !== NODE_TYPES.ELEMENT_NODE) {
    throw new Error(`expect toHaveAttribute value is not an element`);
  }

  const pass = elm.hasAttribute(expectAttrName);

  return {
    message: () => `expected to ${pass ? 'not ' : ''}have the attribute "${expectAttrName}"`,
    pass: pass,
  };
}

export function toEqualAttribute(elm: HTMLElement, expectAttrName: string, expectAttrValue: string) {
  if (!elm) {
    throw new Error(`expect toMatchAttribute value is null`);
  }

  if (typeof (elm as any).then === 'function') {
    throw new Error(`element must be a resolved value, not a promise, before it can be tested`);
  }

  if (elm.nodeType !== NODE_TYPES.ELEMENT_NODE) {
    throw new Error(`expect toMatchAttribute value is not an element`);
  }

  let receivedAttrValue = elm.getAttribute(expectAttrName);

  if (expectAttrValue != null) {
    expectAttrValue = String(expectAttrValue);
  }

  if (receivedAttrValue != null) {
    receivedAttrValue = String(receivedAttrValue);
  }

  const pass = (expectAttrValue === receivedAttrValue);

  return {
    message: () => `expected attribute ${expectAttrName} "${expectAttrValue}" to ${pass ? 'not ' : ''}equal "${receivedAttrValue}"`,
    pass: pass,
  };
}

export function toEqualAttributes(elm: HTMLElement, expectAttrs: {[attrName: string]: any}) {
  if (!elm) {
    throw new Error(`expect toEqualAttributes value is null`);
  }

  if (typeof (elm as any).then === 'function') {
    throw new Error(`element must be a resolved value, not a promise, before it can be tested`);
  }

  if (elm.nodeType !== NODE_TYPES.ELEMENT_NODE) {
    throw new Error(`expect toEqualAttributes value is not an element`);
  }

  const attrNames = Object.keys(expectAttrs);

  const pass = attrNames.every(attrName => {
    let expectAttrValue = expectAttrs[attrName];
    if (expectAttrValue != null) {
      expectAttrValue = String(expectAttrValue);
    }
    return elm.getAttribute(attrName) === expectAttrValue;
  });

  return {
    message: () => `expected attributes to ${pass ? 'not ' : ''}equal ${attrNames.map(a => `[${a}="${expectAttrs[a]}"]`).join(', ')}`,
    pass: pass,
  };
}

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

export function toHaveClass(elm: HTMLElement, expectClassName: string) {
  if (!elm) {
    throw new Error(`expect toHaveClass value is null`);
  }

  if (typeof (elm as any).then === 'function') {
    throw new Error(`element must be a resolved value, not a promise, before it can be tested`);
  }

  if (elm.nodeType !== 1) {
    throw new Error(`expect toHaveClass value is not an element`);
  }

  const pass = elm.classList.contains(expectClassName);

  return {
    message: () => `expected to ${pass ? 'not ' : ''}have css class "${expectClassName}"`,
    pass: pass,
  };
}

export function toHaveClasses(elm: HTMLElement, expectClassNames: string[]) {
  if (!elm) {
    throw new Error(`expect toHaveClasses value is null`);
  }

  if (typeof (elm as any).then === 'function') {
    throw new Error(`element must be a resolved value, not a promise, before it can be tested`);
  }

  if (elm.nodeType !== 1) {
    throw new Error(`expect toHaveClasses value is not an element`);
  }

  const pass = expectClassNames.every(expectClassName => {
    return elm.classList.contains(expectClassName);
  });

  return {
    message: () => `expected to ${pass ? 'not ' : ''}have css classes "${expectClassNames.join(' ')}", but className is "${elm.className}"`,
    pass: pass,
  };
}

export function toMatchClasses(elm: HTMLElement, expectClassNames: string[]) {
  let { pass } = toHaveClasses(elm, expectClassNames);
  if (pass) {
    pass = expectClassNames.length === elm.classList.length;
  }

  return {
    message: () => `expected to ${pass ? 'not ' : ''}match css classes "${expectClassNames.join(' ')}", but className is "${elm.className}"`,
    pass: pass,
  };
}
