import * as d from '../../declarations';
import { flatOne, unique } from '@utils';
import { getScopeId } from '../style/scope-css';
import {injectModulePreloads} from '../html/inject-module-preloads';

export function generateModulePreloads(doc: Document, hydrateResults: d.HydrateResults, componentGraph: Map<string, string[]>) {
  if (!componentGraph) {
    return false;
  }
  const hasImportScript = !!doc.querySelector('script[type=module][data-resources-url]');
  if (!hasImportScript) {
    return false;
  }
  const modulePreloads = unique(
    flatOne(
      hydrateResults.components
        .map(cmp => getScopeId(cmp.tag, cmp.mode))
        .map(scopeId => componentGraph.get(scopeId) || [])
    )
  );

  injectModulePreloads(doc, modulePreloads);
  return true;
}
