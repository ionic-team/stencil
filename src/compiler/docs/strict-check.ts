import * as d from '../../declarations';
import { getMemberDocumentation, isMemberInternal } from './docs-util';
import { MEMBER_TYPE } from '../../util/constants';


export function strickCheckDocs(config: d.Config, docsData: d.DocsData) {
  docsData.components.forEach(cmpData => {
    const filepath = config.sys.path.relative(config.rootDir, cmpData.moduleFile.sourceFilePath);

    if (!cmpData.moduleFile.isCollectionDependency) {
      Object.keys(cmpData.cmpMeta.membersMeta).forEach(memberName => {
        const member = cmpData.cmpMeta.membersMeta[memberName];

        if (memberName[0] !== '_') {
          if (member.memberType === MEMBER_TYPE.Method) {
            if (needsWarn(member.jsdoc)) {
              config.logger.warn(`Method "${memberName}" of "${cmpData.cmpMeta.tagNameMeta}" is not documented. ${filepath}`);
            }
          } else if (member.memberType === MEMBER_TYPE.Prop || member.memberType === MEMBER_TYPE.PropMutable) {
            if (needsWarn(member.jsdoc)) {
              config.logger.warn(`Property "${memberName}" of "${cmpData.cmpMeta.tagNameMeta}" is not documented. ${filepath}`);
            }
          }
        }
      });

      cmpData.cmpMeta.eventsMeta && cmpData.cmpMeta.eventsMeta.forEach(ev => {
        if (needsWarn(ev.jsdoc)) {
          config.logger.warn(`Event "${ev.eventName}" of "${cmpData.cmpMeta.tagNameMeta}" is not documented. ${filepath}`);
        }
      });
    }
  });
}


function needsWarn(jsdoc: d.JsDoc) {
  return !getMemberDocumentation(jsdoc) && !isMemberInternal(jsdoc);
}
