import { testAttributes, testClasslist, testMatchAttributes, testMatchClasslist, testProperties } from './utils';
import { parse } from './mock-doc/parse-html';
import { serialize } from './mock-doc/serialize-node';


declare global {
  namespace jest {
    interface Matchers<R> {
      toEqualHtml(html: string): void;
      toHaveClasses(classlist: string[]): void;
      toMatchClasses(classlist: string[]): void;
      toHaveAttributes(attributes: { [attr: string]: string }): void;
      toMatchAttributes(attributes: { [attr: string]: string }): void;
      toHaveProperties(properties: { [prop: string]: any }): void;
    }
  }
}


export function toEqualHtml(a: string, b: string) {
  const parseA = parse(a);
  const parseB = parse(b);

  const serializeA = serialize(parseA, {
    format: 'html'
  });

  const serializeB = serialize(parseB, {
    format: 'html'
  });

  if (serializeA !== serializeB) {
    expect(serializeA).toBe(serializeB);
    return {
      message: () => 'HTML does not match',
      pass: false,
    };
  }

  return {
    message: () => '',
    pass: true,
  };
}

export function toHaveClasses(element: HTMLElement, classlist: string[]) {
  try {
    testClasslist(element, classlist);
    return {
      message: () => 'expected to not match classes',
      pass: true,
    };
  } catch (msg) {
    return {
      message: () => msg,
      pass: false,
    };
  }
}

export function toMatchClasses(element: HTMLElement, classlist: string[]) {
  try {
    testMatchClasslist(element, classlist);
    return {
      message: () => 'expected to not match classes',
      pass: true,
    };
  } catch (msg) {
    return {
      message: () => msg,
      pass: false,
    };
  }
}

export function toHaveAttributes(element: HTMLElement, attributes: { [attr: string]: string }) {
  try {
    testAttributes(element, attributes);
    return {
      message: () => 'expected to not match attributes',
      pass: true,
    };
  } catch (msg) {
    return {
      message: () => msg,
      pass: false,
    };
  }
}

export function toMatchAttributes(element: HTMLElement, attributes: { [attr: string]: string }) {
  try {
    testMatchAttributes(element, attributes);
    return {
      message: () => 'expected to not match attributes',
      pass: true,
    };
  } catch (msg) {
    return {
      message: () => msg,
      pass: false,
    };
  }
}


export function toHaveProperties(instance: any, properties: { [prop: string]: any }) {
  try {
    testProperties(instance, properties);
    return {
      message: () => 'expected to not match properties',
      pass: true,
    };
  } catch (msg) {
    return {
      message: () => msg,
      pass: false,
    };
  }
}
