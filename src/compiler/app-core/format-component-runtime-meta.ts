import * as d from '../../declarations';


export function formatComponentRuntimeMeta(compilerMeta: d.ComponentCompilerMeta) {
  const runtimeMeta: d.ComponentRuntimeMeta = {};

  if (compilerMeta.encapsulation === 'shadow') {
    runtimeMeta.shadowDomEncapsulation = true;
  } else if (compilerMeta.encapsulation === 'scoped') {
    runtimeMeta.scopedDomEncapsulation = true;
  }

  return JSON.stringify(runtimeMeta);
}


export function formatComponentRuntimeMembers(_compilerMeta: d.ComponentCompilerMeta) {
  const runtimeMembers: d.ComponentRuntimeMember[] = [];

  return JSON.stringify(runtimeMembers);
}
