import { TranspileContext, TranspileOptions } from './interfaces';


const REPLACER_EXPS: {[key: string]: RegExp} = {
  ' v-if': /\ \*if/g,
  ' v-for': /\ \*for/g,
  ' v-bind:class': /\ \[class\]/g,
  ' v-bind:style': /\ \[style\]/g,
  ' v-show': /\ \[show\]/g,
  ' v-html': /\ \[html\]/g,
  ' v-text': /\ \[text\]/g,
  ' v-once': /\ \[once\]/g,
  ' v-model': /\ \[model\]/g,
};
const replaceWithKeys = Object.keys(REPLACER_EXPS);


const WARNING_REPLACER_EXPS: {[key: string]: {regex: RegExp, msg: string} } = {
  'ng-content': {
    regex: /\slot/g,
    msg: `"ng-content" has been deprecated. Please use "<slot>" instead.`
  },
  '*ngIf': {
    regex: /\[if\]/g,
    msg: `"*ngIf" has been deprecated. Please use "*if" instead.`
  },
  '*ngFor': {
    regex: /\[for\]/g,
    msg: `"*ngFor" has been deprecated. Please use "*for" instead.`
  },
  '[(ngModel)]': {
    regex: /\:model/g,
    msg: `"[(ngModel)]" has been deprecated. Please use "[model]" instead.`
  },
  '[hidden]': {
    regex: /\:show]/g,
    msg: `"[hidden]" has been deprecated. Please use "[show]" instead (and update the logic to be the opposite).`
  }
};
const warnReplaceWithKeys = Object.keys(WARNING_REPLACER_EXPS);


export function updateTemplate(tag: string, template: string, opts: TranspileOptions = {}, ctx: TranspileContext = {}) {

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
