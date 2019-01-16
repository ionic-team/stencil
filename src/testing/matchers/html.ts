import { NODE_TYPES, parseHtmlToFragment, serializeNodeToHtml } from '@stencil/core/mock-doc';


export function toEqualHtml(input: string | HTMLElement | ShadowRoot, shouldEqual: string) {
  if (input == null) {
    throw new Error(`expect toEqualHtml value is null`);
  }

  let serializeA: string;

  if ((input as HTMLElement).nodeType === NODE_TYPES.ELEMENT_NODE) {
    serializeA = serializeNodeToHtml((input as any), {
      pretty: true,
      outerHTML: true,
      excludeTags: ['body']
    });

  } else if ((input as HTMLElement).nodeType === NODE_TYPES.DOCUMENT_FRAGMENT_NODE) {
    serializeA = serializeNodeToHtml((input as any), {
      pretty: true,
      excludeTags: ['style'],
      excludeTagContent: ['style']
    });

  } else if (typeof input === 'string') {
    const parseA = parseHtmlToFragment(input);
    serializeA = serializeNodeToHtml(parseA, {
      pretty: true
    });

  } else {
    throw new Error(`expect toEqualHtml value should be an element, shadow root or string`);
  }

  const parseB = parseHtmlToFragment(shouldEqual);

  const serializeB = serializeNodeToHtml(parseB, {
    pretty: true,
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
