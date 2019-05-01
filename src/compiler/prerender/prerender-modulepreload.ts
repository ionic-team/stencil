import * as d from '../../declarations';
import { flatOne, unique } from '@utils';
import { getScopeId } from '../style/scope-css';
import {injectModulePreloads} from '../html/inject-module-preloads';

export function generateModulePreloads(doc: Document, hydrateResults: d.HydrateResults, componnentGraph: Map<string, string[]>) {
  if (!componnentGraph) {
    return;
  }
  const modulePreloads = unique(
    flatOne(
      hydrateResults.components
        .map(cmp => getScopeId(cmp.tag))
        .map(scopeId => componnentGraph.get(scopeId) || [])
    )
  );

  injectModulePreloads(doc, modulePreloads);
}
