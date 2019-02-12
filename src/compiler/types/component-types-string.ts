import * as d from '@declarations';
import { MEMBER_TYPE, captializeFirstLetter, dashToPascalCase, isDocsPublic } from '@utils';
import { StencilModule, TypeInfo } from './types-utils';


/**
 * Generate a string based on the types that are defined within a component.
 *
 * @param cmpMeta the metadata for the component that a type definition string is generated for
 * @param importPath the path of the component file
 */
export function createTypesAsString(cmpMeta: d.ComponentCompilerMeta, _importPath: string): StencilModule {
  const tagName = cmpMeta.tagName;
  const tagNameAsPascal = dashToPascalCase(cmpMeta.tagName);
  const interfaceName = `HTML${tagNameAsPascal}Element`;
  const jsxInterfaceName = `${tagNameAsPascal}Attributes`;
  // const propAttributes = membersToPropAttributes(cmpMeta.membersMeta);
  // const methodAttributes = membersToMethodAttributes(cmpMeta.membersMeta);
  // const eventAttributes = membersToEventAttributes(cmpMeta.eventsMeta);
  const stencilComponentAttributes = attributesToMultiLineString({
    // ...propAttributes,
    // ...methodAttributes
  }, false);
  const stencilComponentJSXAttributes = attributesToMultiLineString({
    // ...propAttributes,
    // ...eventAttributes
  }, true);

  return {
    tagNameAsPascal: tagNameAsPascal,
    StencilComponents: `
interface ${tagNameAsPascal} {${
  stencilComponentAttributes !== '' ? `\n${stencilComponentAttributes}\n` : ''
}}`,
    JSXElements: `
interface ${jsxInterfaceName} extends JSXElements.HTMLAttributes {${
  stencilComponentJSXAttributes !== '' ? `\n${stencilComponentJSXAttributes}\n` : ''
}}`,
    global: `
interface ${interfaceName} extends Components.${tagNameAsPascal}, HTMLElement {}
var ${interfaceName}: {
  prototype: ${interfaceName};
  new (): ${interfaceName};
};`,
    HTMLElementTagNameMap: `'${tagName}': ${interfaceName}`,
    ElementTagNameMap: `'${tagName}': ${interfaceName};`,
    IntrinsicElements: `'${tagName}': Components.${jsxInterfaceName};`
  };
}


function attributesToMultiLineString(attributes: TypeInfo, jsxAttributes: boolean, paddingString = '') {
  if (Object.keys(attributes).length === 0) {
    return '';
  }

  return Object.keys(attributes)
    .sort()
    .reduce((fullList, key) => {
      const type = attributes[key];
      if (type.public || !jsxAttributes) {
        if (type.jsdoc) {
          fullList.push(`/**`);
          fullList.push(` * ${type.jsdoc.replace(/\r?\n|\r/g, ' ')}`);
          fullList.push(` */`);
        }
        const optional = (jsxAttributes)
          ? !type.required
          : type.optional;

        fullList.push(`'${key}'${ optional ? '?' : '' }: ${type.type};`);
      }
      return fullList;
    }, <string[]>[])
    .map(item => `${paddingString}${item}`)
    .join(`\n`);
}


export function membersToPropAttributes(membersMeta: d.MembersMeta): TypeInfo {
  const interfaceData = Object.keys(membersMeta)
    .filter((memberName) => {
      return [ MEMBER_TYPE.Prop ].indexOf(membersMeta[memberName].memberType) !== -1;
    })
    .reduce((obj, memberName) => {
      const member: d.MemberMeta = membersMeta[memberName];
      obj[memberName] = {
        type: member.attribType.text,
        optional: member.attribType.optional,
        required: member.attribType.required,
        public: isDocsPublic(member.jsdoc)
      };

      if (member.jsdoc) {
        obj[memberName].jsdoc = member.jsdoc.documentation;
      }

      return obj;
    }, <TypeInfo>{});

  return interfaceData;
}

export function membersToMethodAttributes(membersMeta: d.MembersMeta): TypeInfo {
  const interfaceData = Object.keys(membersMeta)
    .filter((memberName) => {
      return [ MEMBER_TYPE.Method ].indexOf(membersMeta[memberName].memberType) !== -1;
    })
    .reduce((obj, memberName) => {
      const member: d.MemberMeta = membersMeta[memberName];
      obj[memberName] = {
        type: member.attribType.text,
        optional: false,
        required: false,
        public: isDocsPublic(member.jsdoc)
      };

      if (member.jsdoc) {
        obj[memberName].jsdoc = member.jsdoc.documentation;
      }

      return obj;
    }, <TypeInfo>{});

  return interfaceData;
}


export function membersToEventAttributes(eventMetaList: d.EventMeta[]): TypeInfo {
  const interfaceData = eventMetaList
    .reduce((obj, eventMetaObj) => {
      const memberName = `on${captializeFirstLetter(eventMetaObj.eventName)}`;
      const eventType = (eventMetaObj.eventType) ? `CustomEvent<${eventMetaObj.eventType.text}>` : `CustomEvent`;
      obj[memberName] = {
        type: `(event: ${eventType}) => void`, // TODO this is not good enough
        optional: false,
        required: false,
        public: isDocsPublic(eventMetaObj.jsdoc)
      };

      if (eventMetaObj.jsdoc) {
        obj[memberName].jsdoc = eventMetaObj.jsdoc.documentation;
      }

      return obj;
    }, <TypeInfo>{});

  return interfaceData;
}
