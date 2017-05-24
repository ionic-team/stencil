import { ComponentMeta } from '../interfaces';
import * as ts from 'typescript';


export function getComponentDecoratorData(classNode: ts.ClassDeclaration) {
  let metaData: ComponentMeta = null;

  if (!classNode.decorators) {
    return metaData;
  }

  let isComponent = false;

  classNode.decorators.forEach(decorator => {

    decorator.forEachChild(decoratorChild => {

      decoratorChild.forEachChild(componentChild => {

        if (componentChild.getText().trim() === 'Component') {
          isComponent = true;

        } else if (isComponent) {
          metaData = parseComponentMetaData(componentChild.getText());
        }

      });

    });
  });

  return metaData;
}


function parseComponentMetaData(text: string): ComponentMeta {
  try {
    const fnStr = `return ${text};`;
    let cmpMeta: ComponentMeta = new Function(fnStr)();

    return updateComponentMeta(cmpMeta, text);

  } catch (e) {
    console.log(`parseComponentMetaData: ${e}`);
    console.log(text);
  }
  return null;
}


function updateComponentMeta(cmpMeta: ComponentMeta, orgText: string) {
  if ((<any>cmpMeta).selector) {
    console.log(`Please use "tag" instead of "selector" in component decorator: ${(<any>cmpMeta).selector}`);
    cmpMeta.tag = (<any>cmpMeta).selector;
  }

  if (!cmpMeta.tag || cmpMeta.tag.trim() === '') {
    throw `tag missing in component decorator: ${orgText}`;
  }

  cmpMeta.modes = {};

  updateTag(cmpMeta);
  updateStyles(cmpMeta);
  updateModes(cmpMeta);
  updateShadow(cmpMeta);

  return cmpMeta;
}


function updateTag(cmpMeta: ComponentMeta) {
  cmpMeta.tag = cmpMeta.tag.trim().toLowerCase();

  if (cmpMeta.tag.indexOf(' ') > -1) {
    throw `"${cmpMeta.tag}" tag cannot contain a space`;
  }

  if (cmpMeta.tag.indexOf(',') > -1) {
    throw `"${cmpMeta.tag}" tag cannot be use for multiple tags`;
  }

  let invalidChars = cmpMeta.tag.replace(/\w|-/g, '');
  if (invalidChars !== '') {
    throw `"${cmpMeta.tag}" tag contains invalid characters: ${invalidChars}`;
  }

  if (cmpMeta.tag.indexOf('-') === -1) {
    throw `"${cmpMeta.tag}" tag must contain a dash (-) to work as a valid web component`;
  }

  if (cmpMeta.tag.indexOf('--') > -1) {
    throw `"${cmpMeta.tag}" tag cannot contain multiple dashes (--) next to each other`;
  }

  if (cmpMeta.tag.indexOf('-') === 0) {
    throw `"${cmpMeta.tag}" tag cannot start with a dash (-)`;
  }

  if (cmpMeta.tag.lastIndexOf('-') === cmpMeta.tag.length - 1) {
    throw `"${cmpMeta.tag}" tag cannot end with a dash (-)`;
  }
}


function updateStyles(cmpMeta: ComponentMeta) {
  const styleModes: {[modeName: string]: string} = (<any>cmpMeta).styleUrls;

  if (styleModes) {
    Object.keys(styleModes).forEach(styleModeName => {
      const modeName = styleModeName.trim().toLowerCase();

      cmpMeta.modes[modeName] = {
        styleUrls: [styleModes[styleModeName]]
      };
    });

    delete (<any>cmpMeta).styleUrls;
  }
}


function updateModes(cmpMeta: ComponentMeta) {
  if (Object.keys(cmpMeta.modes).length === 0) {
    cmpMeta.modes['default'] = {};
  }
}


function updateShadow(cmpMeta: ComponentMeta) {
  // default to use shadow dom
  // or figure out a best guess depending on the value they put in
  if (cmpMeta.shadow === undefined) {
    // default to true if it was never defined in the decorator
    cmpMeta.shadow = true;

  } else if (typeof cmpMeta.shadow === 'string') {
    const shadowStr = (<string>cmpMeta.shadow).toLowerCase().trim();

    if (shadowStr === 'false' || shadowStr === 'null' || shadowStr === '') {
      cmpMeta.shadow = false;
    } else {
      cmpMeta.shadow = true;
    }

  } else if (cmpMeta.shadow === null) {
    cmpMeta.shadow = false;

  } else {
    cmpMeta.shadow = !!cmpMeta.shadow;
  }
}
