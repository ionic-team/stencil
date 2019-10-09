
export const inherits = (ctor: any, superCtor: any) => {
  if (ctor === undefined || ctor === null)
    throw new Error(`util.inherits ctor is ${ctor}`);

  if (superCtor === undefined || superCtor === null)
    throw new Error(`util.inherits superCtor is ${superCtor}`);

  if (superCtor.prototype === undefined) {
    throw new Error(`util.inherits superCtor.prototype is ${superCtor.prototype}`);
  }

  Object.defineProperty(ctor, 'super_', {
    value: superCtor,
    writable: true,
    configurable: true
  });
  Object.setPrototypeOf(ctor.prototype, superCtor.prototype);
};

export const inspect = (...args: any[]) => {
  args.forEach(arg => {
    console.log(arg);
  });
};

export default {
  inherits,
  inspect,
  __util: 'patched'
};
