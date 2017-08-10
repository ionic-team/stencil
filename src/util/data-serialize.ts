import { Bundle, ComponentMeta, ComponentRegistry, EventMeta, ListenMeta, LoadComponentRegistry,
  MemberMeta, MembersMeta, ModuleFile, PropChangeMeta, StylesMeta } from './interfaces';
import { HAS_SLOTS, HAS_NAMED_SLOTS, MEMBER_ELEMENT_REF, MEMBER_METHOD,
  MEMBER_PROP, MEMBER_PROP_STATE, MEMBER_PROP_CONNECT, MEMBER_PROP_CONTEXT,
  MEMBER_STATE, TYPE_ANY, TYPE_BOOLEAN, TYPE_NUMBER } from '../util/constants';


export function formatLoadComponentRegistry(cmpMeta: ComponentMeta): LoadComponentRegistry {
  // ensure we've got a standard order of the components
  const d: any[] = [
    cmpMeta.tagNameMeta.toUpperCase(),
    cmpMeta.moduleId,
    formatStyles(cmpMeta.stylesMeta),
    formatObserveAttributeProps(cmpMeta.membersMeta),
    formatListeners(cmpMeta.listenersMeta),
    formatSlot(cmpMeta.slotMeta),
    cmpMeta.loadPriority
  ];

  return <any>trimFalsyData(d);
}


export function formatStyles(styleMeta: StylesMeta): any {
  if (!styleMeta) {
    return 0;
  }

  const stylesIds: any = {};

  Object.keys(styleMeta).sort().forEach(modeName => {
    stylesIds[modeName] = styleMeta[modeName].styleId;
  });

  return stylesIds;
}


function formatSlot(val: number) {
  if (val === HAS_SLOTS) {
    return HAS_SLOTS;
  }
  if (val === HAS_NAMED_SLOTS) {
    return HAS_NAMED_SLOTS;
  }
  return 0;
}


function formatObserveAttributeProps(membersMeta: MembersMeta) {
  if (!membersMeta) {
    return 0;
  }

  const observeAttrs: any[] = [];

  const memberNames = Object.keys(membersMeta).sort();

  memberNames.forEach(memberName => {
    const memberMeta = membersMeta[memberName];

    if (!memberMeta.attribName) {
      return;
    }

    const d: any[] = [
      memberName,
      memberMeta.memberType
    ];

    if (memberMeta.propType === TYPE_BOOLEAN) {
      d.push(TYPE_BOOLEAN);

    } else if (memberMeta.propType === TYPE_NUMBER) {
      d.push(TYPE_NUMBER);

    } else {
      d.push(TYPE_ANY);
    }

    if (memberMeta.ctrlId) {
      d.push(memberMeta.ctrlId);
    }

    observeAttrs.push(d);
  });

  if (!observeAttrs.length) {
    return 0;
  }

  return observeAttrs.map(p => {
    return trimFalsyData(p);
  });
}


function formatListeners(listeners: ListenMeta[]) {
  if (!listeners || !listeners.length) {
    return 0;
  }

  return listeners.map(listener => {
    const d: any[] = [
      listener.eventName,
      listener.eventMethodName,
      listener.eventDisabled ? 1 : 0,
      listener.eventPassive ? 1 : 0,
      listener.eventCapture ? 1 : 0
    ];
    return trimFalsyData(d);
  });
}


export function formatComponentRegistry(registry: ComponentRegistry) {
  // ensure we've got a standard order of the components
  return Object.keys(registry).sort().map(tag => {
    if (registry[tag]) {
      return formatLoadComponentRegistry(registry[tag]);
    }
    return null;
  }).filter(c => c);
}


export function formatLoadComponents(
    namespace: string,
    moduleId: string,
    moduleBundleOutput: string,
    moduleFiles: ModuleFile[]
  ) {

  // ensure we've got a standard order of the components
  moduleFiles = moduleFiles.sort((a, b) => {
    if (a.cmpMeta.tagNameMeta < b.cmpMeta.tagNameMeta) return -1;
    if (a.cmpMeta.tagNameMeta > b.cmpMeta.tagNameMeta) return 1;
    return 0;
  });

  const componentMetaStr = moduleFiles.map(moduleFile => {
    return formatComponentMeta(moduleFile.cmpMeta);
  }).join(',\n');

  return [
    `${namespace}.loadComponents(\n`,

      `/**** module id (dev mode) ****/`,
      `"${moduleId}",\n`,

      `/**** component modules ****/`,
      `${moduleBundleOutput},\n`,

      `${componentMetaStr}`,

    `)`
  ].join('\n');
}


export function formatComponentMeta(cmpMeta: ComponentMeta) {
  const tag = cmpMeta.tagNameMeta.toLowerCase();
  const members = formatMembers(cmpMeta.membersMeta);
  const host = formatHost(cmpMeta.hostMeta);
  const propWillChanges = formatPropChanges(tag, 'prop will change', cmpMeta.propsWillChangeMeta);
  const propDidChanges = formatPropChanges(tag, 'prop did change', cmpMeta.propsDidChangeMeta);
  const events = formatEvents(tag, cmpMeta.eventsMeta);
  const shadow = formatShadow(cmpMeta.isShadowMeta);

  const d: string[] = [];

  d.push(`/** ${tag}: tag **/\n"${tag.toUpperCase()}"`);
  d.push(`/** ${tag}: members **/\n${members}`);
  d.push(`/** ${tag}: host **/\n${host}`);
  d.push(`/** ${tag}: events **/\n${events}`);
  d.push(`/** ${tag}: propWillChanges **/\n${propWillChanges}`);
  d.push(`/** ${tag}: propDidChanges **/\n${propDidChanges}`);
  d.push(`/** ${tag}: shadow **/\n${shadow}`);

  return `\n/***************** ${tag} *****************/\n[\n` + trimFalsyDataStr(d).join(',\n\n') + `\n\n]`;
}


function formatMembers(membersMeta: MembersMeta) {
  if (!membersMeta) {
    return '0 /* no members */';
  }

  const memberNames = Object.keys(membersMeta).sort((a, b) => {
    if (a.toLowerCase() < b.toLowerCase()) return -1;
    if (a.toLowerCase() > b.toLowerCase()) return 1;
    return 0;
  });

  if (!memberNames.length) {
    return '0 /* no members */';
  }

  const members = memberNames.map(memberName => {
    return formatMemberMeta(memberName, membersMeta[memberName]);
  });

  return `[${members}\n]`;
}


function formatMemberMeta(memberName: string, memberMeta: MemberMeta) {
  const d: string[] = [];

  d.push(`"${memberName}"`);
  d.push(formatMemberType(memberMeta.memberType));
  d.push(formatPropType(memberMeta.propType));
  d.push(formatPropContext(memberMeta.ctrlId));

  return '\n  [ ' + trimFalsyDataStr(d).join(', ') + ' ]';
}


function formatMemberType(val: number) {
  if (val === MEMBER_ELEMENT_REF) {
    return `/** element ref **/ ${MEMBER_ELEMENT_REF}`;
  }
  if (val === MEMBER_METHOD) {
    return `/** method **/ ${MEMBER_METHOD}`;
  }
  if (val === MEMBER_PROP) {
    return `/** prop **/ ${MEMBER_PROP}`;
  }
  if (val === MEMBER_PROP_STATE) {
    return `/** prop state **/ ${MEMBER_PROP_STATE}`;
  }
  if (val === MEMBER_STATE) {
    return `/** state **/ ${MEMBER_STATE}`;
  }
  if (val === MEMBER_PROP_CONNECT) {
    return `/** prop connect **/ ${MEMBER_PROP_CONNECT}`;
  }
  if (val === MEMBER_PROP_CONTEXT) {
    return `/** prop context **/ ${MEMBER_PROP_CONTEXT}`;
  }
  return `/** unknown ****/ 0`;
}


function formatPropType(val: number) {
  if (val === TYPE_BOOLEAN) {
    return `/** type boolean **/ ${TYPE_BOOLEAN}`;
  }
  if (val === TYPE_NUMBER) {
    return `/** type number **/ ${TYPE_NUMBER}`;
  }
  return `/** type any **/ ${TYPE_ANY}`;
}


function formatPropContext(val: string) {
  if (val === undefined) {
    return `0`;
  }
  return `/** context ***/ "${val}"`;
}


function formatHost(val: any) {
  if (val === undefined) {
    return '0 /* no host data */';
  }
  return JSON.stringify(val);
}


function formatBoolean(val: boolean) {
  return val ?
    '1 /* true **/' :
    '0 /* false */';
}


function formatPropChanges(label: string, propChangeType: string, propChange: PropChangeMeta[]) {
  if (!propChange || !propChange.length) {
    return `0 /* no ${propChangeType} methods */`;
  }

  const t: string[] = [];

  propChange.forEach((propChange, index) => {
    t.push(formatPropChangeOpts(label, propChangeType, propChange, index));
  });

  return `[\n` + t.join(',\n') + `\n]`;
}


function formatPropChangeOpts(label: string, propChangeType: string, propChange: PropChangeMeta, index: number) {
  const t = [
    `    /*****  ${label} ${propChangeType} [${index}] ***** /\n` +
    `    /* prop name **/ "${propChange[0]}"`,
    `    /* call fn *****/ "${propChange[1]}"`
  ];

  return `  [\n` + t.join(',\n') + `\n  ]`;
}


function formatEvents(label: string, events: EventMeta[]) {
  if (!events || !events.length) {
    return '0 /* no events */';
  }

  const t: string[] = [];

  events.forEach(eventMeta => {
    t.push(formatEventOpts(label, eventMeta));
  });

  return `[\n` + t.join(',\n') + `\n]`;
}


function formatEventOpts(label: string, eventMeta: EventMeta) {
  const t = [
    `    /*****  ${label} ${eventMeta.eventName} ***** /\n` +
    `    /* event name ***/ "${eventMeta.eventName}"`,
    `    /* method name **/ ${eventMeta.eventMethodName !== eventMeta.eventName ? '"' + eventMeta.eventMethodName + '"' : 0}`,
    `    /* disable bubbles **/ ${formatBoolean(!eventMeta.eventBubbles)}`,
    `    /* disable cancelable **/ ${formatBoolean(!eventMeta.eventCancelable)}`,
    `    /* disable composed **/ ${formatBoolean(!eventMeta.eventComposed)}`
  ];

  return `  [\n` + trimFalsyDataStr(t).join(',\n') + `\n  ]`;
}


function formatShadow(val: boolean) {
  return val ?
    '1 /* use shadow dom */' :
    '0 /* do not use shadow dom */';
}


export function formatJsBundleFileName(jsBundleId: string) {
  return `${jsBundleId}.js`;
}


export function formatCssBundleFileName(cssBundleId: string) {
  return `${cssBundleId}.css`;
}


export function getBundledModulesId(bundle: Bundle) {
  return bundle.components.map(c => c.toLowerCase()).sort().join('.');
}


export function generateBundleId(tags: string[]) {
  return tags.sort((a, b) => {
    if (a.toLowerCase() < b.toLowerCase()) return -1;
    if (a.toLowerCase() > b.toLowerCase()) return 1;
    return 0;
  }).join('.');
}


function trimFalsyData(d: string[]) {
  for (var i = d.length - 1; i >= 0; i--) {
    if (d[i]) {
      break;
    }
    // if falsy, safe to pop()
    d.pop();
  }

  return d;
}


function trimFalsyDataStr(d: string[]) {
  const arrData: any[] = new Function(`return [${d.join(',').replace(/\n/gm, '')}]`)();

  for (var i = arrData.length - 1; i >= 0; i--) {
    if (arrData[i]) {
      break;
    }
    // if falsy, safe to pop()
    d.pop();
  }

  return d;
}
