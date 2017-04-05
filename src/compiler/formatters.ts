import { Component, ComponentMode, Registry } from './interfaces';
import * as nodeUtil from 'util';


export function getBundleFileName(bundleId: string) {
  return `ionic.${bundleId}.js`;
}


export function getBundleContent(bundleId: string, componentModeLoader: string) {
  return `Ionic.loadComponents('${bundleId}',${componentModeLoader});`;
}


export function getComponentModeLoader(component: Component, mode: ComponentMode) {
  const t = [
    `'` + component.tag + `'`,
    `'` + mode.name + `'`,
    `'` + mode.styles.replace(/'/g, '"') + `'`,
    component.componentImporter
  ];

  return `[` + t.join(',') + `]`;
}


export function getRegistryContent(registry: Registry) {
  let content = '(window.Ionic = window.Ionic || {}).components = ';
  content += nodeUtil.inspect(registry, false, null) + ';';
  return content;
}


export function getBundleId(bundleIndex: number) {
  return bundleIndex.toString();
}
