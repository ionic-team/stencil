
// member names that shouldn't be used as public
// methods and properties because it'll conflict
// with the event listener attributes and properties on the prototype
const RESERVED_PUBLIC_MEMBERS = [
  'oncopy', 'oncopycapture', 'oncut', 'oncutcapture', 'onpaste', 'onpastecapture', 'oncompositionend', 'oncompositionendcapture',
  'oncompositionstart', 'oncompositionstartcapture', 'oncompositionupdate', 'oncompositionupdatecapture', 'onfocus',
  'onfocuscapture', 'onblur', 'onblurcapture', 'onchange', 'onchangecapture', 'oninput', 'oninputcapture', 'onreset',
  'onresetcapture', 'onsubmit', 'onsubmitcapture', 'oninvalid', 'oninvalidcapture', 'onload', 'onloadcapture', 'onerror',
  'onerrorcapture', 'onkeydown', 'onkeydowncapture', 'onkeypress', 'onkeypresscapture', 'onkeyup', 'onkeyupcapture', 'onclick',
  'onclickcapture', 'oncontextmenu', 'oncontextmenucapture', 'ondblclick', 'ondblclickcapture', 'ondrag', 'ondragcapture',
  'ondragend', 'ondragendcapture', 'ondragenter', 'ondragentercapture', 'ondragexit', 'ondragexitcapture', 'ondragleave',
  'ondragleavecapture', 'ondragover', 'ondragovercapture', 'ondragstart', 'ondragstartcapture', 'ondrop', 'ondropcapture',
  'onmousedown', 'onmousedowncapture', 'onmouseenter', 'onmouseleave', 'onmousemove', 'onmousemovecapture', 'onmouseout',
  'onmouseoutcapture', 'onmouseover', 'onmouseovercapture', 'onmouseup', 'onmouseupcapture', 'ontouchcancel',
  'ontouchcancelcapture', 'ontouchend', 'ontouchendcapture', 'ontouchmove', 'ontouchmovecapture', 'ontouchstart',
  'ontouchstartcapture', 'onscroll', 'onscrollcapture', 'onwheel', 'onwheelcapture', 'onanimationstart', 'onanimationstartcapture',
  'onanimationend', 'onanimationendcapture', 'onanimationiteration', 'onanimationiterationcapture', 'ontransitionend',
  'ontransitionendcapture', 'oncuechange', 'onclose', 'oncanplaythrough', 'oncancel', 'onbeforepaste', 'onbeforecut',
  'onbeforecopy', 'onauxclick', 'onabort', 'onlostpointercapture', 'onloadstart', 'onloadedmetadata', 'onloadeddata',
  'ongotpointercapture', 'onfullscreenerror', 'onfullscreenchange', 'onended', 'onemptied', 'ondurationchange',
  'onpause', 'onplay', 'onplaying', 'onpointercancel', 'onpointerdown', 'onpointerenter', 'onpointerleave', 'onpointermove',
  'onpointerout', 'onpointerover', 'onpointerup', 'onprogress', 'onratechange', 'onresize', 'onsearch', 'onseeked', 'onseeking',
  'onselectstart', 'onstalled', 'onsuspend', 'ontimeupdate', 'ontoggle', 'onvolumechange', 'onwaiting',
  'onwebkitfullscreenchange', 'onwebkitfullscreenerror'
];


export function isReservedMember(memberName: string) {
  memberName = memberName.toLowerCase();
  return RESERVED_PUBLIC_MEMBERS.includes(memberName);
}

