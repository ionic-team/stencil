const createCustomElement = () => {
  if (typeof Reflect === 'undefined') {
    return HTMLElement;
  }
  const BuiltInHTMLElement = HTMLElement;
  const NewHTMLElement = function HTMLElement() {
    return Reflect.construct(
        BuiltInHTMLElement, [], this.constructor);
  };
  NewHTMLElement.prototype = BuiltInHTMLElement.prototype;
  NewHTMLElement.prototype.constructor = NewHTMLElement;
  Object.setPrototypeOf(NewHTMLElement, BuiltInHTMLElement);
  return NewHTMLElement as any as {
      prototype: HTMLElement;
      new(): HTMLElement;
  };
};

declare const STENCIL_SOURCE_TARGET: string;

const NewHTMLElement = (typeof STENCIL_SOURCE_TARGET === 'string' && STENCIL_SOURCE_TARGET === 'es2017')
  ? HTMLElement
  : /*@__PURE__*/createCustomElement();

export { NewHTMLElement as HTMLElement };
