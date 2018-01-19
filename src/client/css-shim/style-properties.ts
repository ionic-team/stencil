import { StyleNode, removeCustomPropAssignment } from './css-parse';
import * as StyleUtil from './style-util';
/* tslint:disable */

export class StyleProperties {
  private matchesSelector: Function;

  constructor(private win: Window) {
    this.matchesSelector = ((p) => p.matches || p.matchesSelector ||
      p.mozMatchesSelector || p.msMatchesSelector ||
      p.webkitMatchesSelector)((win as any).Element.prototype);
  }

  // decorate a single rule with property info
  private decorateRule(rule: StyleNode) {
    if (rule.propertyInfo) {
      return rule.propertyInfo;
    }
    let info: any = {}, properties: any = {};
    let hasProperties = this.collectProperties(rule, properties);
    if (hasProperties) {
      info.properties = properties;
      // TODO(sorvell): workaround parser seeing mixins as additional rules
      rule.rules = null;
    }
    info.cssText = rule.parsedCssText;
    rule.propertyInfo = info;
    return info;
  }

  // collects the custom properties from a rule's cssText
  private collectProperties(rule: StyleNode, properties: any) {
    let info = rule.propertyInfo;
    if (info) {
      if (info.properties) {
        Object.assign(properties, info.properties);
        return true;
      }

    } else {
      let m: RegExpExecArray;
      let cssText = rule.parsedCssText;
      let value: any;
      let a: any;

      while ((m = VAR_ASSIGN.exec(cssText))) {
        // note: group 2 is var, 3 is mixin
        value = (m[2] || m[3]).trim();
        // value of 'inherit' or 'unset' is equivalent to not setting the property here
        if (value !== 'inherit' || value !== 'unset') {
          properties[m[1].trim()] = value;
        }
        a = true;
      }
      return a;
    }
  }

  // turns custom properties into realized values.
  reify(props: any) {
    // big perf optimization here: reify only *own* properties
    // since this object has __proto__ of the element's scope properties
    let names = Object.getOwnPropertyNames(props);
    for (let i = 0, n; i < names.length; i++) {
      n = names[i];
      props[n] = this.valueForProperty(props[n], props);
    }
  }

  // given a property value, returns the reified value
  // a property value may be:
  // (1) a literal value like: red or 5px;
  // (2) a variable value like: var(--a), var(--a, red), or var(--a, --b) or
  // var(--a, var(--b));
  private valueForProperty(property: any, props: any) {
    // case (1) default
    if (property) {
      if (property.indexOf(';') >= 0) {
        property = this.valueForProperties(property, props);

      } else {
        // case (2) variable
        let fn = (prefix: any, value: any, fallback: any, suffix: any) => {
          if (!value) {
            return prefix + suffix;
          }
          let propertyValue = this.valueForProperty(props[value], props);
          // if value is "initial", then the variable should be treated as unset
          if (!propertyValue || propertyValue === 'initial') {
            // fallback may be --a or var(--a) or literal
            propertyValue = this.valueForProperty(props[fallback] || fallback, props) || fallback;
          }

          return prefix + (propertyValue || '') + suffix;
        };

        property = StyleUtil.processVariableAndFallback(property, fn);
      }
    }
    return property && property.trim() || '';
  }

  // note: we do not yet support mixin within mixin
  private valueForProperties(property: any, props: any) {
    let parts = property.split(';');

    for (let i = 0, p; i < parts.length; i++) {
      if ((p = parts[i])) {
        let colon = p.indexOf(':');
        if (colon !== -1) {
          let pp = p.substring(colon);
          pp = pp.trim();
          pp = this.valueForProperty(pp, props) || pp;
          p = p.substring(0, colon) + pp;
        }
        parts[i] = (p && p.lastIndexOf(';') === p.length - 1) ?
          // strip trailing ;
          p.slice(0, -1) :
          p || '';
      }
    }

    return parts.join(';');
  }

  // Test if the rules in these styles matches the given `element` and if so,
  // collect any custom properties into `props`.
  propertyDataFromStyles(rules: any, element: Element) {
    let props: any = {};

    // generates a unique key for these matches
    let o: any[] = [];

    // note: active rules excludes non-matching @media rules
    StyleUtil.forEachRule(this.win, rules, (rule) => {
      // TODO(sorvell): we could trim the set of rules at declaration
      // time to only include ones that have properties
      if (!rule.propertyInfo) {
        this.decorateRule(rule);
      }

      // match element against transformedSelector: selector may contain
      // unwanted uniquification and parsedSelector does not directly match
      // for :host selectors.
      try {
        let selectorToMatch = rule.transformedSelector || rule.parsedSelector;

        if (element && rule.propertyInfo.properties && selectorToMatch) {
          if (this.matchesSelector.call(element, selectorToMatch)) {
            this.collectProperties(rule, props);
            // produce numeric key for these matches for lookup
            addToBitMask(rule.index, o);
          }
        }
      } catch (e) {
        console.error(e);
      }

    }, null, true);

    return { properties: props, key: o };
  }

  applyCustomStyle(style: any, properties: any) {
    let rules = StyleUtil.rulesForStyle(style);

    style.textContent = StyleUtil.toCssText(this.win, rules, (rule) => {
      let css = rule.cssText = rule.parsedCssText;
      if (rule.propertyInfo && rule.propertyInfo.cssText) {
        // remove property assignments
        // so next function isn't confused
        // NOTE: we have 3 categories of css:
        // (1) normal properties,
        // (2) custom property assignments (--foo: red;),
        // (3) custom property usage: border: var(--foo); @apply(--foo);
        // In elements, 1 and 3 are separated for efficiency; here they
        // are not and this makes this case unique.
        css = removeCustomPropAssignment(css);

        // replace with reified properties, scenario is same as mixin
        rule.cssText = this.valueForProperties(css, properties);
      }
    });
  }
}

function addToBitMask(n: number, bits: number[]) {
  let o = parseInt(((n / 32) as any), 10);
  let v = 1 << (n % 32);
  bits[o] = (bits[o] || 0) | v;
}

const VAR_ASSIGN = /(?:^|[;\s{]\s*)(--[\w-]*?)\s*:\s*(?:((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};{])+)|\{([^}]*)\}(?:(?=[;\s}])|$))/gi;
