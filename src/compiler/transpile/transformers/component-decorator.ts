import { BuildConfig, ComponentMeta, ComponentOptions, Diagnostic, ModuleFile } from '../../../util/interfaces';
import { buildError, catchError } from '../../util';
import { ENCAPSULATION } from '../../../util/constants';
import { normalizeAssetsDir } from '../../component-plugins/assets-plugin';
import { normalizeStyles } from './normalize-styles';
import { validateComponentTag } from '../../../util/validate-config';
import * as ts from 'typescript';


export function getComponentDecoratorData(config: BuildConfig, moduleFile: ModuleFile, diagnostics: Diagnostic[], classNode: ts.ClassDeclaration) {
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
          metaData = parseComponentMetaData(config, moduleFile, diagnostics, componentChild.getText());
        }

      });

    });
  });

  return metaData;
}


function parseComponentMetaData(config: BuildConfig, moduleFile: ModuleFile, diagnostics: Diagnostic[], text: string) {
  let cmpMeta: ComponentMeta = null;

  try {
    const fnStr = `return ${text};`;

    // parse user component options
    const userOpts: ComponentOptions = new Function(fnStr)();

    if (!userOpts.tag || userOpts.tag.trim() === '') {
      throw new Error(`tag missing in component decorator: ${text}`);
    }

    // convert user component options from user into component meta
    cmpMeta = {};

    // normalize user data
    normalizeTag(config, moduleFile, diagnostics, userOpts, cmpMeta, text);
    normalizeStyles(config, userOpts, moduleFile, cmpMeta);
    normalizeAssetsDir(config, userOpts, moduleFile, cmpMeta);
    normalizeHost(userOpts, cmpMeta);
    normalizeEncapsulation(userOpts, cmpMeta);

  } catch (e) {
    // derp
    const d = catchError(diagnostics, e);
    d.absFilePath = moduleFile.tsFilePath;
    d.relFilePath = config.sys.path.relative(config.rootDir, moduleFile.tsFilePath);
    d.messageText = `${e}: ${text}`;
  }

  return cmpMeta;
}


function normalizeTag(config: BuildConfig, moduleFile: ModuleFile, diagnostics: Diagnostic[], userOpts: ComponentOptions, cmpMeta: ComponentMeta, orgText: string) {
  if ((<any>userOpts).selector) {
    const d = buildError(diagnostics);
    d.messageText = `Please use "tag" instead of "selector" in component decorator: ${(<any>userOpts).selector}`;
    d.absFilePath = moduleFile.tsFilePath;
    d.relFilePath = config.sys.path.relative(config.rootDir, moduleFile.tsFilePath);

    cmpMeta.tagNameMeta = (<any>userOpts).selector;
  }

  if (!userOpts.tag || userOpts.tag.trim() === '') {
    throw new Error(`tag missing in component decorator: ${orgText}`);
  }

  cmpMeta.tagNameMeta = validateComponentTag(userOpts.tag);
}


export function normalizeEncapsulation(userOpts: ComponentOptions, cmpMeta: ComponentMeta) {
  // default to NOT use shadow dom or scoped css...to start, debatable later on

  if (typeof userOpts.shadow === 'boolean') {
    cmpMeta.encapsulation = ENCAPSULATION.ShadowDom;

  } else if (typeof userOpts.scoped === 'boolean') {
    cmpMeta.encapsulation = ENCAPSULATION.ScopedCss;

  } else {
    cmpMeta.encapsulation = ENCAPSULATION.NoEncapsulation;
  }
}


function normalizeHost(userOpts: ComponentOptions, cmpMeta: ComponentMeta) {
  cmpMeta.hostMeta = userOpts.host || {};
}
