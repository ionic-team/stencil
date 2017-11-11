import { testClasslist, testAttributes } from '../utils';

declare global {
  namespace jest {
    interface Matchers {
      toMatchClasses(classlist: string[]): void;
      toMatchAttributes(attributes: { [attr: string]: string }): void;
    }
  }
}

export function toMatchClasses(element: HTMLElement, classlist: string[]) {
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
export function toMatchAttributes(element: HTMLElement, attributes: { [attr: string]: string }) {
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
