import { NODE_TYPES, parseHtmlToFragment, serializeNodeToHtml } from '@mock-doc';


export function toEqualHtml(input: string | HTMLElement | ShadowRoot, shouldEqual: string) {
  if (input == null) {
    throw new Error(`expect toEqualHtml() value is "${input}"`);
  }

  if (typeof (input as any).then === 'function') {
    throw new Error(`element must be a resolved value, not a promise, before it can be tested`);
  }

  let serializeA: string;

  if ((input as HTMLElement).nodeType === NODE_TYPES.ELEMENT_NODE) {
    serializeA = serializeNodeToHtml((input as any), {
      prettyHtml: true,
      outerHtml: true,
      excludeTags: ['body'],
      serializeShadowRoot: true
    });

  } else if ((input as HTMLElement).nodeType === NODE_TYPES.DOCUMENT_FRAGMENT_NODE) {
    serializeA = serializeNodeToHtml((input as any), {
      prettyHtml: true,
      excludeTags: ['style'],
      excludeTagContent: ['style'],
      serializeShadowRoot: true
    });

  } else if (typeof input === 'string') {
    const parseA = parseHtmlToFragment(input);
    serializeA = serializeNodeToHtml(parseA, {
      prettyHtml: true,
      serializeShadowRoot: true
    });

  } else {
    throw new Error(`expect toEqualHtml() value should be an element, shadow root or string.`);
  }

  const parseB = parseHtmlToFragment(shouldEqual);

  const serializeB = serializeNodeToHtml(parseB, {
    prettyHtml: true,
    excludeTags: ['body']
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
