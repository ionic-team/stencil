import { TranspileContext, TranspileOptions } from './interfaces';


const REPLACER_EXPS: {[key: string]: RegExp} = {
  ' v-if': /\ \:if/g,
  ' v-for': /\ \:for/g,
  ' v-show': /\ \:show/g,
};
const replaceWithKeys = Object.keys(REPLACER_EXPS);

const WARNING_REPLACER_EXPS: {[key: string]: {regex: RegExp, msg: string} } = {
  'ng-content': {
    regex: /\slot/g,
    msg: `"ng-content" has been deprecated. Please use "<slot>" instead.`
  },
  '*ngIf': {
    regex: /\:if/g,
    msg: `"*ngIf" has been deprecated. Please use ":if" instead.`
  },
  '*ngFor': {
    regex: /\:for/g,
    msg: `"*ngFor" has been deprecated. Please use ":for" instead.`
  },
  '[hidden]': {
    regex: /\:show/g,
    msg: `"[hidden]" has been deprecated. Please use ":show" instead.`
  }
};
const warnReplaceWithKeys = Object.keys(WARNING_REPLACER_EXPS);


export function generateTemplate(tag: string, template: string, opts: TranspileOptions, ctx: TranspileContext) {

  replaceWithKeys.forEach(replaceWithKey => {
    template = template.replace(REPLACER_EXPS[replaceWithKey], replaceWithKey);
  });

  warnReplaceWithKeys.forEach(warnReplaceWithKey => {
    if (template.indexOf(warnReplaceWithKey) > -1) {
      template = template.replace(WARNING_REPLACER_EXPS[warnReplaceWithKey].regex, warnReplaceWithKey);
      console.log(`${tag} - "${WARNING_REPLACER_EXPS[warnReplaceWithKey].msg}"`);
    }
  });

  return template;
}
