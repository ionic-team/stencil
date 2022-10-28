export const inherits = (ctor: any, superCtor: any) => {
  if (superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true,
      },
    });
  }
};

export const inspect = (...args: any[]) => args.forEach((arg) => console.log(arg));

export const promisify = (fn: Function): (() => Promise<any>) => {
  if (typeof (fn as any)[promisify.custom] === 'function') {
    // https://nodejs.org/api/util.html#util_custom_promisified_functions
    return function (...args: any[]) {
      return (fn as any)[promisify.custom].apply(this, args);
    };
  }

  return function (...args: any[]) {
    return new Promise((resolve, reject) => {
      args.push((err: any, result: any) => {
        if (err != null) {
          reject(err);
        } else {
          resolve(result);
        }
      });
      fn.apply(this, args);
    });
  };
};

promisify.custom = Symbol('promisify.custom');

export default {
  inherits,
  inspect,
  promisify,
};
