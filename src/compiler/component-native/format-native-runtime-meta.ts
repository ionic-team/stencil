import * as d from '../../declarations';
import { formatComponentRuntimeMeta } from '../app-core/format-component-runtime-meta';


export function formatComponentRuntimeArrays(cmps: d.ComponentCompilerNativeData[]) {
  return `[${cmps.map(cmp => {
    return formatComponentRuntimeArray(cmp);
  }).join(',\n')}]`;
}


function formatComponentRuntimeArray(cmp: d.ComponentCompilerNativeData) {
  const c: string[] = [];

  c.push(`[`);

  // 0
  c.push(`\n'${cmp.tagName}'`);

  // 1
  c.push(`,\n${cmp.componentClassName}`);

  // 2
  c.push(`,\n${formatComponentRuntimeMeta(cmp.cmpCompilerMeta, false)}`);

  c.push(`]\n`);

  return c.join('');
}
