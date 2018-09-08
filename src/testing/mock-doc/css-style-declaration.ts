

export function createCSSStyleDeclaration() {
  const style: {[prop: string]: string } = {};

  Object.defineProperties(style, {

    setProperty: {
      value: function (name: string, value: string) {
        name = cssCaseToJsCase(name);

        if (value === '') {
          delete this[name];
        } else {
          this[name] = value;
        }
      }
    },

    getPropertyValue: {
      value: function (name: string) {
        return this[name].toString();
      }
    },

    removeProperty: {
      value: function (name: string) {
        delete this[cssCaseToJsCase(name)];
      }
    },

    cssText: {
      get: function() {
        const cssText: string[] = [];

        Object.keys(style).forEach(name => {
          if (typeof (style as any)[name] !== 'function') {
            if ((style as any)[name] === '') {
              delete (style as any)[name];
            } else {
              cssText.push(jsCaseToCssCase(name), ': ', (style as any)[name], '; ');
            }
          }
        });

        return cssText.join('').trim();
      },
      set: function(value: string) {
        value;
      }
    }

  });

  return style;
}


function cssCaseToJsCase(str: string) {
  if (str.length > 1 && str.includes('-')) {
    str = str.toLowerCase().split('-').map(segment => segment.charAt(0).toUpperCase() + segment.slice(1)).join('');
    str = str.substr(0, 1).toLowerCase() + str.substr(1);
  }

  return str;
}


function jsCaseToCssCase(str: string) {
  if (str.length > 1 && (!str.includes('-') && /[A-Z]/.test(str))) {
    str = str.replace(/([A-Z])/g, g => ' ' + g[0]).trim().replace(/ /g, '-').toLowerCase();
  }

  return str;
}
