import { BuildContext, ComponentMeta, FileMeta, ListenOpts } from '../interfaces';
import * as ts from 'typescript';


export function componentClass(ctx: BuildContext): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext) => {

    function visitClass(fileMeta: FileMeta, classNode: ts.ClassDeclaration) {
      fileMeta.cmpMeta = getComponentDecoratorData(classNode);

      if (fileMeta.cmpMeta) {
        fileMeta.hasCmpClass = true;
        fileMeta.cmpClassName = classNode.name.getText().trim();

        getPropertyDecoratorMeta(fileMeta.cmpMeta, classNode);
        getListenDecoratorMeta(fileMeta.cmpMeta, classNode);
        getWatchDecoratorMeta(fileMeta.cmpMeta, classNode);

        return removeClassDecorator(classNode);
      }

      fileMeta.hasCmpClass = false;
      return classNode;
    }


    function removeClassDecorator(classNode: ts.ClassDeclaration) {
      const classWithoutDecorators = ts.createClassDeclaration(
          undefined!, classNode.modifiers!, classNode.name!, classNode.typeParameters!,
          classNode.heritageClauses!, classNode.members);

      return classWithoutDecorators;
    }


    function getPropertyDecoratorMeta(cmpMeta: ComponentMeta, classNode: ts.ClassDeclaration) {
      const propMembers = classNode.members.filter(n => n.decorators && n.decorators.length);

      cmpMeta.props = {};

      propMembers.forEach(memberNode => {
        let isProp = false;
        let propName: string = null;
        let type: string = null;

        memberNode.forEachChild(n => {

          if (n.kind === ts.SyntaxKind.Decorator && n.getChildCount() > 1 && n.getChildAt(1).getFirstToken().getText() === 'Prop') {
            isProp = true;

          } else if (isProp) {
            if (n.kind === ts.SyntaxKind.Identifier && !propName) {
              propName = n.getText();

            } else if (!type) {
              if (n.kind === ts.SyntaxKind.BooleanKeyword) {
                type = 'boolean';

              } else if (n.kind === ts.SyntaxKind.StringKeyword) {
                type = 'string';

              } else if (n.kind === ts.SyntaxKind.NumberKeyword) {
                type = 'number';

              } else if (n.kind === ts.SyntaxKind.TypeReference) {
                type = 'Type';
              }
            }
          }

        });

        if (isProp && propName) {
          cmpMeta.props[propName] = {};

          if (type) {
            cmpMeta.props[propName].type = type;
          }

          memberNode.decorators = undefined;
        }
      });
    }


    function getListenDecoratorMeta(cmpMeta: ComponentMeta, classNode: ts.ClassDeclaration) {
      const propMembers = classNode.members.filter(n => n.decorators && n.decorators.length);

      cmpMeta.listeners = {};

      propMembers.forEach(memberNode => {
        let isListen = false;
        let methodName: string = null;
        let opts: ListenOpts = {};

        memberNode.forEachChild(n => {

          if (n.kind === ts.SyntaxKind.Decorator && n.getChildCount() > 1 && n.getChildAt(1).getFirstToken().getText() === 'Listen') {
            isListen = true;

            n.getChildAt(1).forEachChild(n => {

              if (n.kind === ts.SyntaxKind.StringLiteral && !opts.eventName) {
                opts.eventName = n.getText();
                opts.eventName = opts.eventName.replace(/\'/g, '');
                opts.eventName = opts.eventName.replace(/\"/g, '');
                opts.eventName = opts.eventName.replace(/\`/g, '');

              } else if (n.kind === ts.SyntaxKind.ObjectLiteralExpression && opts.eventName) {
                try {
                  const fnStr = `return ${n.getText()};`;
                  let parsedOpts: ListenOpts = new Function(fnStr)();

                  Object.assign(opts, parsedOpts);

                } catch (e) {
                  console.log(`parse listener options: ${e}`);
                }
              }
            });

          } else if (isListen) {
            if (n.kind === ts.SyntaxKind.Identifier && !methodName) {
              methodName = n.getText();
            }
          }

        });

        if (isListen && opts.eventName && methodName) {
          opts.capture = !!opts.capture;
          opts.passive = !!opts.passive;
          opts.enabled = !!opts.enabled;
          cmpMeta.listeners[methodName] = opts;

          memberNode.decorators = undefined;
        }
      });
    }


    function getWatchDecoratorMeta(cmpMeta: ComponentMeta, classNode: ts.ClassDeclaration) {
      const propMembers = classNode.members.filter(n => n.decorators && n.decorators.length);

      cmpMeta.watches = {};

      propMembers.forEach(memberNode => {
        let isWatch = false;
        let propName: string = null;
        let methodName: string = null;

        memberNode.forEachChild(n => {

          if (n.kind === ts.SyntaxKind.Decorator && n.getChildCount() > 1 && n.getChildAt(1).getFirstToken().getText() === 'Watch') {
            isWatch = true;

            n.getChildAt(1).forEachChild(n => {

              if (n.kind === ts.SyntaxKind.StringLiteral && !propName) {
                propName = n.getText();
                propName = propName.replace(/\'/g, '');
                propName = propName.replace(/\"/g, '');
                propName = propName.replace(/\`/g, '');
              }

            });

          } else if (isWatch) {
            if (n.kind === ts.SyntaxKind.Identifier && !methodName) {
              methodName = n.getText();
            }
          }

        });

        if (isWatch && propName && methodName) {
          cmpMeta.watches[propName] = {
            fn: methodName
          };

          memberNode.decorators = undefined;
        }
      });
    }


    function visit(fileMeta: FileMeta, node: ts.Node): ts.VisitResult<ts.Node> {
      switch (node.kind) {

        case ts.SyntaxKind.ClassDeclaration:
          return visitClass(fileMeta, node as ts.ClassDeclaration);

        default:
          return ts.visitEachChild(node, (node) => {
            return visit(fileMeta, node);
          }, transformContext);
      }
    }


    return (tsSourceFile) => {
      const fileMeta = ctx.files.get(tsSourceFile.fileName);
      if (fileMeta && fileMeta.hasCmpClass) {
        return visit(fileMeta, tsSourceFile) as ts.SourceFile;
      }

      return tsSourceFile;
    }
  }

}


function getComponentDecoratorData(classNode: ts.ClassDeclaration) {
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

  if (!cmpMeta.tag || cmpMeta.tag.trim() == '') {
    throw `tag missing in component decorator: ${orgText}`;
  }

  cmpMeta.modes = {};

  updateTag(cmpMeta);
  updateStyles(cmpMeta);
  updateModes(cmpMeta);
  updateShadow(cmpMeta);

  return cmpMeta;
}


function updateTag(cmpMeta: ComponentMeta) {
  cmpMeta.tag = cmpMeta.tag.trim().toLowerCase();

  let invalidChars = cmpMeta.tag.replace(/\w|-/g, '');
  if (invalidChars !== '') {
    throw `"${cmpMeta.tag}" tag contains invalid characters: ${invalidChars}`
  }

  if (cmpMeta.tag.indexOf('-') === -1) {
    throw `"${cmpMeta.tag}" tag must contain a dash (-)`;
  }

  if (cmpMeta.tag.indexOf('-') === 0) {
    throw `"${cmpMeta.tag}" tag cannot start with a dash (-)`;
  }

  if (cmpMeta.tag.lastIndexOf('-') === cmpMeta.tag.length - 1) {
    throw `"${cmpMeta.tag}" tag cannot end with a dash (-)`;
  }
}


function updateStyles(cmpMeta: ComponentMeta) {
  const styleModes: {[modeName: string]: string} = (<any>cmpMeta).styleUrls;

  if (styleModes) {
    Object.keys(styleModes).forEach(styleModeName => {
      cmpMeta.modes[styleModeName] = {
        styleUrls: [styleModes[styleModeName]]
      }
    });
  }
}


function updateModes(cmpMeta: ComponentMeta) {
  if (Object.keys(cmpMeta.modes).length === 0) {
    cmpMeta.modes['default'] = {};
  }
}


function updateShadow(cmpMeta: ComponentMeta) {
  // default to use shadow dom
  // or figure out a best guess depending on the value they put in
  if (typeof cmpMeta.shadow === 'string') {
    const shadowStr = (<string>cmpMeta.shadow).toLowerCase().trim();

    if (shadowStr === 'false' || shadowStr === 'null' || shadowStr === '') {
      cmpMeta.shadow = false;
    } else {
      cmpMeta.shadow = true;
    }

  } else if (cmpMeta.shadow === undefined) {
    cmpMeta.shadow = true;

  } else if (cmpMeta.shadow === null) {
    cmpMeta.shadow = false;

  } else {
    cmpMeta.shadow = !!cmpMeta.shadow;
  }
}

