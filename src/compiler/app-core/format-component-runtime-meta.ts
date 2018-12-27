import * as d from '../../declarations';


export function formatComponentRuntimeMeta(build: d.Build, compilerMeta: d.ComponentCompilerMeta) {
  const runtimeMeta: d.ComponentRuntimeMeta = {};

  if (build.member) {
    const members = formatComponentRuntimeMembers(compilerMeta);
    if (members.length > 0) {
      runtimeMeta.members = members;
    }
  }

  if (compilerMeta.encapsulation === 'shadow') {
    runtimeMeta.shadowDomEncapsulation = true;
  } else if (compilerMeta.encapsulation === 'scoped') {
    runtimeMeta.scopedDomEncapsulation = true;
  }

  return JSON.stringify(runtimeMeta);
}


function formatComponentRuntimeMembers(_compilerMeta: d.ComponentCompilerMeta) {
  const runtimeMembers: d.ComponentRuntimeMember[] = [];

  return runtimeMembers;
}
