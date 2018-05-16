import { toLowerCase } from '../../util/helpers';


export function updateAttribute(elm: HTMLElement, memberName: string, newValue: any, isBoolean?: boolean, forceRemove?: boolean) {
  const isXlinkNs = (memberName !== (memberName = memberName.replace(/^xlink\:?/, '')));
  const isBooleanAttr = BOOLEAN_ATTRS[memberName] || isBoolean;

  if ((isBooleanAttr && (!newValue || newValue === 'false')) || forceRemove) {
    if (isXlinkNs) {
      elm.removeAttributeNS(XLINK_NS, toLowerCase(memberName));

    } else {
      elm.removeAttribute(memberName);
    }

  } else if (typeof newValue !== 'function') {
    if (isBooleanAttr) {
      newValue = '';
    }
    if (isXlinkNs) {
      elm.setAttributeNS(XLINK_NS, toLowerCase(memberName), newValue);

    } else {
      elm.setAttribute(memberName, newValue);
    }
  }
}


const BOOLEAN_ATTRS: any = {
  'allowfullscreen': 1,
  'async': 1,
  'autofocus': 1,
  'autoplay': 1,
  'checked': 1,
  'controls': 1,
  'disabled': 1,
  'enabled': 1,
  'formnovalidate': 1,
  'hidden': 1,
  'multiple': 1,
  'noresize': 1,
  'readonly': 1,
  'required': 1,
  'selected': 1,
  'spellcheck': 1,
};


const XLINK_NS = 'http://www.w3.org/1999/xlink';
