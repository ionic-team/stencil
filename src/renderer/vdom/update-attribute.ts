import { toLowerCase } from '../../util/helpers';


export function updateAttribute(
  elm: HTMLElement,
  memberName: string,
  newValue: any,
  isBooleanAttr = typeof newValue === 'boolean',
) {
  const isXlinkNs = (memberName !== (memberName = memberName.replace(/^xlink\:?/, '')));
  if (newValue == null || (isBooleanAttr && (!newValue || newValue === 'false'))) {
    if (isXlinkNs) {
      elm.removeAttributeNS(XLINK_NS, toLowerCase(memberName));

    } else {
      elm.removeAttribute(memberName);
    }

  } else if (typeof newValue !== 'function') {
    if (isBooleanAttr) {
      newValue = '';
    } else {
      newValue = newValue.toString();
    }
    if (isXlinkNs) {
      elm.setAttributeNS(XLINK_NS, toLowerCase(memberName), newValue);

    } else {
      elm.setAttribute(memberName, newValue);
    }
  }
}

const XLINK_NS = 'http://www.w3.org/1999/xlink';
