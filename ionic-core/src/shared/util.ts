

export function noop() {};


export var ionDevWarn: Function = noop;


if (process.env.NODE_ENV !== 'production') {

  ionDevWarn = function (msg: string) {
    if (typeof console !== 'undefined') {
      console.error(`[Ionic warn]: ${msg}`);
    }
  };

}
