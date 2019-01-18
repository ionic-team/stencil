import * as d from '@declarations';
import { MEMBER_TYPE, PROP_TYPE } from '@utils';


export function formatComponentRuntimeMeta(compilerMeta: d.ComponentCompilerMeta, includeTagName: boolean) {
  // NOT using JSON.stringify so that properties can get renamed/minified
  const runtimeMeta: string[] = [];

  if (includeTagName) {
    runtimeMeta.push(`cmpTag: "${compilerMeta.tagName}"`);
  }

  const membersStr = formatComponentRuntimeMembers(compilerMeta);
  if (membersStr != null) {
    runtimeMeta.push(`members: ${membersStr}`);
  }

  if (compilerMeta.encapsulation === 'shadow') {
    runtimeMeta.push(`shadowDomEncapsulation: 1`);
  } else if (compilerMeta.encapsulation === 'scoped') {
    runtimeMeta.push(`scopedCssEncapsulation: 1`);
  }

  return `{` + runtimeMeta.join(', ') + `}`;
}


function formatComponentRuntimeMembers(compilerMeta: d.ComponentCompilerMeta) {
  const runtimeMembers: d.ComponentRuntimeMember[] = [];

  if (compilerMeta.properties) {
    runtimeMembers.push(
      ...compilerMeta.properties.map(formatPropertyRuntimeMember)
    );
  }

  if (compilerMeta.states) {
    runtimeMembers.push(
      ...compilerMeta.states.map(formatStateRuntimeMember)
    );
  }

  if (compilerMeta.methods) {
    runtimeMembers.push(
      ...compilerMeta.methods.map(formatMethodRuntimeMember)
    );
  }

  if (compilerMeta.events) {
    runtimeMembers.push(
      ...compilerMeta.events.map(formatEventRuntimeMember)
    );
  }

  if (runtimeMembers.length === 0) {
    return null;
  }

  // using JSON.stringify so the properties are "quoted"
  // so the minifier DOES NOT property rename each property
  return JSON.stringify(runtimeMembers);
}


function formatPropertyRuntimeMember(compilerProperty: d.ComponentCompilerProperty): d.ComponentRuntimeMember {
  const runtimeProperty: d.ComponentRuntimeMember = [
    /**
     * [0] member name
     */
    compilerProperty.name,

    /**
     * [1] member type
     */
    compilerProperty.mutable ? MEMBER_TYPE.PropMutable : MEMBER_TYPE.Prop,

    /**
     * [2] prop type
     */
    formatPropType(compilerProperty.type),

    /**
     * [3] attribute name to observe
     */
    formatAttrName(compilerProperty),

    /**
     * [4] reflect to attribute
     */
    shortBoolean(compilerProperty.reflectToAttr),

  ];

  return trimFalsy(runtimeProperty);
}


function formatAttrName(compilerProperty: d.ComponentCompilerProperty) {
  if (typeof compilerProperty.attr === 'string') {
    // string attr name means we should observe this attribute
    if (compilerProperty.name === compilerProperty.attr) {
      // property name and attribute name are the exact same
      // true value means to use the property name for the attribute name
      return 1;
    }
    // property name and attribute name are not the same
    // so we need to return the actual string value
    // example: "multiWord" !== "multi-word"
    return compilerProperty.attr;
  }
  // we shouldn't even observe an attribute for this property
  return 0;
}


function formatPropType(type: d.ComponentCompilerPropertyType) {
  if (type === 'string') {
    return PROP_TYPE.String;
  }
  if (type === 'number') {
    return PROP_TYPE.Number;
  }
  if (type === 'boolean') {
    return PROP_TYPE.Boolean;
  }
  if (type === 'any') {
    return PROP_TYPE.Any;
  }
  return PROP_TYPE.Unknown;
}


function formatStateRuntimeMember(compilerState: d.ComponentCompilerState): d.ComponentRuntimeMember {
  const runtimeState: d.ComponentRuntimeMember = [
    /**
     * [0] member name
     */
    compilerState.name,

    /**
     * [1] member type
     */
    MEMBER_TYPE.State
  ];

  return runtimeState as any;
}


function formatMethodRuntimeMember(compilerState: d.ComponentCompilerState): d.ComponentRuntimeMember {
  const runtimeMethod: d.ComponentRuntimeMember = [
    /**
     * [0] member name
     */
    compilerState.name,

    /**
     * [1] member type
     */
    MEMBER_TYPE.Method
  ];

  return runtimeMethod as any;
}


function formatEventRuntimeMember(compilerState: d.ComponentCompilerState): d.ComponentRuntimeMember {
  const runtimeMethod: d.ComponentRuntimeMember = [
    /**
     * [0] member name
     */
    compilerState.name,

    /**
     * [1] member type
     */
    MEMBER_TYPE.Event
  ];

  return runtimeMethod as any;
}


function shortBoolean(val: boolean): boolean {
  return (val ? 1 : 0) as any;
}


function trimFalsy(data: any): any {
  const arr = (data as any[]);
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i]) {
      break;
    }
    // if falsy, safe to pop()
    arr.pop();
  }

  return arr;
}
