import * as d from '../../declarations';
import { catchError } from '@utils';
import { getScopeId } from '../style/scope-css';
import { scopeCss as shadowCss } from '../../utils/shadow-css';


export const scopeCss = async (code: string, tagName: string, opts: d.ScopeCssOptions = {}) => {
  const results: d.ScopeCssResults = {
    diagnostics: [],
    code: (typeof code === 'string') ? code : '',
    map: null
  };

  try {
    const scopeId = getScopeId(tagName, opts.mode);
    results.code = shadowCss(code, scopeId, opts.commentOriginalSelector);

  } catch (e) {
    catchError(results.diagnostics, e);
  }

  return results;
};
