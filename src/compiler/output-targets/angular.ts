import * as d from '../../declarations';
import { MEMBER_TYPE, PROP_TYPE } from '../../util/constants';


export function angularDirectiveProxyOutputs(config: d.Config, compilerCtx: d.CompilerCtx, cmpRegistry: d.ComponentRegistry) {
  const angularOuputTargets = (config.outputTargets as d.OutputTargetAngular[]).filter(o => o.type === 'angular' && o.directivesProxyFile);

  return Promise.all(angularOuputTargets.map(angularOuputTarget => {
    return angularDirectiveProxyOutput(config, compilerCtx, angularOuputTarget, cmpRegistry);
  }));
}


async function angularDirectiveProxyOutput(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetAngular, cmpRegistry: d.ComponentRegistry) {
  let c = angularDirectiveProxies(outputTarget.excludeComponents, cmpRegistry);

  const angularImports: string[] = [];

  if (c.includes('@NgDirective')) {
    angularImports.push('Directive as NgDirective');
  }

  if (c.includes('@NgInput')) {
    angularImports.push('Input as NgInput', 'ElementRef');
    c = angularProxyInput() + c;
  }

  if (c.includes('@NgOutput')) {
    angularImports.push('Output as NgOutput');
    angularImports.push('EventEmitter as NgEventEmitter');
    c = angularProxyOutput() + c;
  }

  c = `/* angular directive proxies */\nimport { ${angularImports.sort().join(', ')} } from '@angular/core';\n\n` + c;

  await compilerCtx.fs.writeFile(outputTarget.directivesProxyFile, c);

  config.logger.debug(`generated angular directives: ${outputTarget.directivesProxyFile}`);
}


function angularProxyInput() {
  return [
    `export function inputs(instance: any, el: ElementRef, props: string[]) {`,
    `  props.forEach(propName => {`,
    `    Object.defineProperty(instance, propName, {`,
    `      get: () => el.nativeElement[propName], set: (val: any) => el.nativeElement[propName] = val`,
    `    });`,
    `  });`,
    `}\n`
  ].join('\n') + '\n';
}


function angularProxyOutput() {
  return [
    `export function outputs(instance: any, events: string[]) {`,
    `  events.forEach(eventName => {`,
    `    instance[eventName] = new NgEventEmitter();`,
    `  });`,
    `}\n`
  ].join('\n') + '\n';
}


function angularDirectiveProxies(excludeComponents: string[], cmpRegistry: d.ComponentRegistry) {
  const metadata = Object.keys(cmpRegistry).map(key => cmpRegistry[key])
    .filter(c => {
      return !excludeComponents.includes(c.tagNameMeta);
    })
    .sort((a, b) => {
      if (a.componentClass < b.componentClass) return -1;
      if (a.componentClass > b.componentClass) return 1;
      return 0;
    });

  const allInstanceMembers: string[] = [];

  let c = metadata.map(cmpMeta => angularDirectiveProxy(allInstanceMembers, cmpMeta)).join('\n');

  allInstanceMembers.sort();

  const instanceMembers = allInstanceMembers.map(v => `${v} = '${v}'`).join(', ');

  c = `const ${instanceMembers};\n\n${c}`;

  return c;
}


function angularDirectiveProxy(allInstanceMembers: string[], cmpMeta: d.ComponentMeta) {
  const o: string[] = [];
  const inputMembers: string[] = [];
  const outputMembers: string[] = [];

  o.push(`@NgDirective({ selector: '${cmpMeta.tagNameMeta}' })`);
  o.push(`export class ${cmpMeta.componentClass} {`);

  Object.keys(cmpMeta.membersMeta).forEach(memberName => {
    const m = cmpMeta.membersMeta[memberName];

    if (m.memberType === MEMBER_TYPE.Prop || m.memberType === MEMBER_TYPE.PropMutable) {
      if (m.propType === PROP_TYPE.String || m.propType === PROP_TYPE.Number || m.propType === PROP_TYPE.Boolean || m.propType === PROP_TYPE.Any) {
        o.push(getInput(memberName, m));

        if (RESERVED_KEYWORDS.includes(memberName)) {
          inputMembers.push(`'${memberName}'`);

        } else {
          if (!allInstanceMembers.includes(memberName)) {
            allInstanceMembers.push(memberName);
          }

          inputMembers.push(memberName);
        }
      }
    }
  });

  cmpMeta.eventsMeta.forEach(eventMeta => {
    o.push(`  @NgOutput() ${eventMeta.eventName}: NgEventEmitter<any>;`);

    if (RESERVED_KEYWORDS.includes(eventMeta.eventName)) {
      outputMembers.push(`'${eventMeta.eventName}'`);

    } else {
      if (!allInstanceMembers.includes(eventMeta.eventName)) {
        allInstanceMembers.push(eventMeta.eventName);
      }

      outputMembers.push(eventMeta.eventName);
    }
  });

  if (inputMembers.length > 0 || outputMembers.length > 0) {
    o.push(`  constructor(${inputMembers.length > 0 ? `el: ElementRef` : ``}) {`);

    if (inputMembers.length > 0) {
      o.push(`    inputs(this, el, [${inputMembers.join(`, `)}]);`);
    }

    if (outputMembers.length > 0) {
      o.push(`    outputs(this, [${outputMembers.join(`, `)}]);`);
    }

    o.push(`  }`);
  }

  o.push(`}\n`);

  return o.join('\n');
}


function getInput(memberName: string, memberMeta: d.MemberMeta) {
  return `${getJsDocs(memberMeta)}  @NgInput() ${memberName}: ${getPropType(memberMeta.propType)};`;
}


function getJsDocs(m: d.MemberMeta) {
  let c = '';

  if (m.jsdoc && m.jsdoc.documentation) {
    c += `  /**\n`;
    c += `   * ${m.jsdoc.documentation.replace(/\r?\n|\r/g, ' ')}\n`;
    c += `   */\n`;
  }

  return c;
}


function getPropType(propType: PROP_TYPE) {
  if (propType === PROP_TYPE.String) {
    return 'string';
  }
  if (propType === PROP_TYPE.Number) {
    return 'number';
  }
  if (propType === PROP_TYPE.Boolean) {
    return 'boolean';
  }
  return 'any';
}

const RESERVED_KEYWORDS = [
  'interface'
];
