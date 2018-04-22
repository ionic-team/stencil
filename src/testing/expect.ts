import { testAttributes, testClasslist, testMatchAttributes, testMatchClasslist, testProperties } from './utils';

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
