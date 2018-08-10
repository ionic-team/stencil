import { testAttributes, testClasslist, testMatchAttributes, testMatchClasslist, testProperties } from './utils';


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
  const htmlBeautify = require('html-beautify');

  while (a.includes('  ')) {
    a = a.replace(/  /g, ' ');
  }

  while (b.includes('  ')) {
    b = b.replace(/  /g, ' ');
  }

  while (/>\s/.test(a)) {
    a = a.replace(/\>\s/g, '>');
  }

  while (/>\s/.test(b)) {
    b = b.replace(/>\s/g, '>');
  }

  while (/\s</.test(a)) {
    a = a.replace(/\s</g, '<');
  }

  while (/\s</.test(b)) {
    b = b.replace(/\s</g, '<');
  }

  a = htmlBeautify(a);
  b = htmlBeautify(b);

  if (a !== b) {
    expect(a).toBe(b);
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
