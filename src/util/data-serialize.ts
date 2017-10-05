import { Bundle, ComponentMeta, ComponentRegistry, EventMeta, ListenMeta, LoadComponentRegistry,
  MemberMeta, MembersMeta, ModuleFile, PropChangeMeta, StylesMeta } from './interfaces';
import { MEMBER_TYPE, PROP_TYPE, SLOT } from '../util/constants';


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
  if (val === SLOT.HasSlots) {
    return SLOT.HasSlots;
  }
  if (val === SLOT.HasNamedSlots) {
    return SLOT.HasNamedSlots;
  }
  return SLOT.NoSlots;
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

    if (memberMeta.propType === PROP_TYPE.Boolean || memberMeta.propType === PROP_TYPE.Number || memberMeta.propType === PROP_TYPE.String) {
      d.push(memberMeta.propType);

    } else {
      d.push(PROP_TYPE.Any);
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
  if (val === MEMBER_TYPE.Element) {
    return `/** element ref **/ ${MEMBER_TYPE.Element}`;
  }
  if (val === MEMBER_TYPE.Method) {
    return `/** method **/ ${MEMBER_TYPE.Method}`;
  }
  if (val === MEMBER_TYPE.Prop) {
    return `/** prop **/ ${MEMBER_TYPE.Prop}`;
  }
  if (val === MEMBER_TYPE.PropMutable) {
    return `/** prop mutable **/ ${MEMBER_TYPE.PropMutable}`;
  }
  if (val === MEMBER_TYPE.State) {
    return `/** state **/ ${MEMBER_TYPE.State}`;
  }
  if (val === MEMBER_TYPE.PropConnect) {
    return `/** prop connect **/ ${MEMBER_TYPE.PropConnect}`;
  }
  if (val === MEMBER_TYPE.PropContext) {
    return `/** prop context **/ ${MEMBER_TYPE.PropContext}`;
  }
  return `/** unknown ****/ 0`;
}


function formatPropType(val: number) {
  if (val === PROP_TYPE.String) {
    return `/** type string **/ ${PROP_TYPE.String}`;
  }
  if (val === PROP_TYPE.Boolean) {
    return `/** type boolean **/ ${PROP_TYPE.Boolean}`;
  }
  if (val === PROP_TYPE.Number) {
    return `/** type number **/ ${PROP_TYPE.Number}`;
  }
  return `/** type any **/ ${PROP_TYPE.Any}`;
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
