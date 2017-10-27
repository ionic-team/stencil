import { BuildContext, CoreBuildConditionals } from '../../../util/interfaces';
import * as ts from 'typescript';


export function loadComponentBuildSections(ctx: BuildContext, classNode: ts.ClassDeclaration) {
  const coreBuild = ctx.coreBuildConditionals;

  classNode.members.forEach(memberNode => {
    memberNode.forEachChild(memberNodeChild => {
      if (memberNodeChild.kind === ts.SyntaxKind.Identifier) {
        setBuildSectionFromMembers(coreBuild, memberNodeChild.getText());
      }
    });
  });

  if (!coreBuild._build_svg_render) {
    const classText = classNode.getText().toLowerCase();
    // if any class contains the text "svg" anywhere
    // then let's enable the svg sections of the renderer
    coreBuild._build_svg_render = (classText.indexOf('svg') > -1);
  }
}


export function setBuildSectionFromMembers(coreBuild: CoreBuildConditionals, memberName: string) {
  switch (memberName) {
    case 'componentWillLoad':
      coreBuild._build_will_load = true;
      return;

    case 'componentDidLoad':
      coreBuild._build_did_load = true;
      return;

    case 'componentWillUpdate':
      coreBuild._build_will_update = true;
      return;

    case 'componentDidUpdate':
      coreBuild._build_did_update = true;
      return;

    case 'componentWillUnload':
      coreBuild._build_will_unload = true;
      return;

    case 'componentDidUnload':
      coreBuild._build_did_unload = true;
      return;

    case 'hostData':
      coreBuild._build_host_render = true;
      return;

    case 'render':
      coreBuild._build_render = true;
      return;
  }
}
