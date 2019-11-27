
export const inherits = (ctor, superCtor) => {
  if (superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  }
};

export const inspect = (...args) =>
  args.forEach(arg => console.log(arg));

export default {
  inherits,
  inspect,
};
