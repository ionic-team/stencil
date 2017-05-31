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
  updateHostMeta(cmpMeta);

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
  if (!(<any>cmpMeta).styleUrls) {
    return;
  }

  // normalize the possible styleUrl structures

  if (typeof (<any>cmpMeta).styleUrls === 'string') {
    // as a string
    // styleUrls: 'my-styles.scss'

    if (!(<any>cmpMeta).styleUrls.trim().length) {
      throw `invalid style url for ${cmpMeta.tag}: ${(<any>cmpMeta).styleUrls}`;
    }

    cmpMeta.modes['default'] = {
      styleUrls: [(<any>cmpMeta).styleUrls.trim()]
    };

  } else if (Array.isArray((<any>cmpMeta).styleUrls)) {
    // as an array of strings
    // styleUrls: ['my-styles.scss', 'my-other-styles']

    cmpMeta.modes['default'] = {
      styleUrls: []
    };

    (<any>cmpMeta).styleUrls.forEach((styleUrl: string) => {
      if (styleUrl && typeof styleUrl === 'string' && styleUrl.trim().length) {
        cmpMeta.modes['default'].styleUrls.push(styleUrl.trim());
      } else {
        throw `invalid style url for ${cmpMeta.tag}: ${styleUrl}`;
      }
    });

  } else {
    // as an object
    // styleUrls: {
    //   ios: 'badge.ios.scss',
    //   md: 'badge.md.scss',
    //   wp: 'badge.wp.scss'
    // }

    const styleModes: {[modeName: string]: string} = (<any>cmpMeta).styleUrls;

    Object.keys(styleModes).forEach(styleModeName => {
      const modeName = styleModeName.trim().toLowerCase();
      cmpMeta.modes[modeName] = {
        styleUrls: []
      };

      if (typeof styleModes[styleModeName] === 'string') {
        const styleUrl = styleModes[styleModeName].trim();
        if (!styleUrl.length) {
          throw `invalid style url for ${cmpMeta.tag}: ${styleModes[styleModeName]}`;
        }

        cmpMeta.modes[modeName].styleUrls.push(styleUrl);

      } else if (Array.isArray(styleModes[styleModeName])) {
        const styleUrls: string[] = (<any>cmpMeta).styleUrls;

        styleUrls.forEach(styleUrl => {
          if (styleUrl && typeof styleUrl === 'string' && styleUrl.trim().length) {
            cmpMeta.modes[modeName].styleUrls.push(styleUrl.trim());
          } else {
            throw `invalid style url for ${cmpMeta.tag}: ${styleUrl}`;
          }
        });

      } else {
        throw `invalid style url for ${cmpMeta.tag}: ${styleModes[styleModeName]}`;
      }
    });

  }

  // remove the original user data now that we've parsed it out
  delete (<any>cmpMeta).styleUrls;
}


function updateModes(cmpMeta: ComponentMeta) {
  const modeNames = Object.keys(cmpMeta.modes).sort();

  if (modeNames.length === 0) {
    // always set a default, even if there's nothing
    cmpMeta.modes['default'] = {};

  } else {
    // normalize mode name sorting
    const modes = Object.assign({}, cmpMeta.modes);
    cmpMeta.modes = {};

    modeNames.forEach(modeName => {
      cmpMeta.modes[modeName] = modes[modeName];
    });
  }
}


function updateShadow(cmpMeta: ComponentMeta) {
  // default to NOT use shadow dom
  let shadow = false;

  // or figure out a best guess depending on the value they put in
  if (cmpMeta.shadow !== undefined) {
    if (typeof cmpMeta.shadow === 'string') {
      if ((<string>cmpMeta.shadow).toLowerCase().trim() === 'true') {
        shadow = true;
      }

    } else {
      // ensure it's a boolean
      shadow = !!cmpMeta.shadow;
    }
  }

  cmpMeta.shadow = shadow;
}

function updateHostMeta(cmpMeta: ComponentMeta) {
  cmpMeta.host = cmpMeta.host || {};
}
