import { BuildContext, ComponentMeta, FileMeta, ListenOpts } from '../interfaces';
import * as ts from 'typescript';


export function componentClass(ctx: BuildContext): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext) => {

    function visitClass(srcContext: SourceContext, fileMeta: FileMeta, classNode: ts.ClassDeclaration) {
      const cmpMeta = getComponentDecoratorData(classNode);

      if (cmpMeta) {
        if (fileMeta.cmpMeta) {
          throw `file cannot have multiple @Components: ${fileMeta.filePath}`;
        }

        fileMeta.cmpMeta = cmpMeta;

        srcContext.cmpClassCount++;
        fileMeta.hasCmpClass = true;
        fileMeta.cmpClassName = classNode.name.getText().trim();

        getMethodsMeta(fileMeta.cmpMeta, classNode);
        getPropertyDecoratorMeta(fileMeta.cmpMeta, classNode);
        getListenDecoratorMeta(fileMeta.cmpMeta, classNode);
        getWatchDecoratorMeta(fileMeta.cmpMeta, classNode);

        return removeClassDecorator(classNode);

      } else if (!fileMeta.cmpMeta) {
        fileMeta.hasCmpClass = false;
      }

      return classNode;
    }


    function removeClassDecorator(classNode: ts.ClassDeclaration) {
      const classWithoutDecorators = ts.createClassDeclaration(
          undefined!, classNode.modifiers!, classNode.name!, classNode.typeParameters!,
          classNode.heritageClauses!, classNode.members);

      return classWithoutDecorators;
    }


    function getMethodsMeta(cmpMeta: ComponentMeta, classNode: ts.ClassDeclaration) {
      cmpMeta.methods = [];

      const decoratedMembers = classNode.members.filter(n => n.decorators && n.decorators.length);
      const methodMemebers = decoratedMembers.filter(n => n.kind === ts.SyntaxKind.MethodDeclaration);

      methodMemebers.forEach(methodNode => {
        let isMethod = false;
        let methodName: string = null;

        methodNode.forEachChild(n => {
          if (n.kind === ts.SyntaxKind.Decorator && n.getChildCount() > 1 && n.getChildAt(1).getFirstToken().getText() === 'Method') {
            isMethod = true;

          } else if (isMethod) {
            if (n.kind === ts.SyntaxKind.Identifier && !methodName) {
              methodName = n.getText();
            }
          }
        });

        if (isMethod && methodName) {
          cmpMeta.methods.push(methodName);
          methodNode.decorators = undefined;
        }
      });

      cmpMeta.methods = cmpMeta.methods.sort();
    }


    function getPropertyDecoratorMeta(cmpMeta: ComponentMeta, classNode: ts.ClassDeclaration) {
      cmpMeta.props = {};

      const decoratedMembers = classNode.members.filter(n => n.decorators && n.decorators.length);

      decoratedMembers.forEach(memberNode => {
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
      cmpMeta.listeners = {};

      const decoratedMembers = classNode.members.filter(n => n.decorators && n.decorators.length);

      decoratedMembers.forEach(memberNode => {
        let isListen = false;
        let methodName: string = null;
        let eventName: string = null;
        let opts: ListenOpts = {};

        memberNode.forEachChild(n => {

          if (n.kind === ts.SyntaxKind.Decorator && n.getChildCount() > 1 && n.getChildAt(1).getFirstToken().getText() === 'Listen') {
            isListen = true;

            n.getChildAt(1).forEachChild(n => {

              if (n.kind === ts.SyntaxKind.StringLiteral && !eventName) {
                eventName = n.getText().trim();
                eventName = eventName.replace(/\'/g, '');
                eventName = eventName.replace(/\"/g, '');
                eventName = eventName.replace(/\`/g, '');
                eventName = eventName.trim();

              } else if (n.kind === ts.SyntaxKind.ObjectLiteralExpression && eventName) {
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
              methodName = n.getText().trim();
            }
          }

        });

        if (isListen && eventName && methodName) {
          memberNode.decorators = undefined;

          if (opts.capture === undefined) {
            opts.capture = false;
          }
          opts.capture = !!opts.capture;

          if (opts.passive === undefined) {
            // they didn't set if it should be passive or not
            // so let's figure out some good defaults depending
            // on what type of event this is

            if (PASSIVE_TRUE_DEFAULTS.indexOf(eventName.toLowerCase()) > -1) {
              // good list of known events that we should default to passive
              opts.passive = true;

            } else {
              // play it safe and have all others default to NOT be passive
              opts.passive = false;
            }
          }
          opts.passive = !!opts.passive;

          if (opts.enabled === undefined) {
            opts.enabled = true;
          }
          opts.enabled = !!opts.enabled;

          opts.eventName = eventName;

          cmpMeta.listeners[methodName] = opts;
        }
      });
    }


    function getWatchDecoratorMeta(cmpMeta: ComponentMeta, classNode: ts.ClassDeclaration) {
      cmpMeta.watchers = {};

      const propMembers = classNode.members.filter(n => n.decorators && n.decorators.length);

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
          cmpMeta.watchers[propName] = {
            fn: methodName
          };

          memberNode.decorators = undefined;
        }
      });
    }


    function visit(srcContext: SourceContext, fileMeta: FileMeta, node: ts.Node): ts.VisitResult<ts.Node> {
      switch (node.kind) {

        case ts.SyntaxKind.ClassDeclaration:
          return visitClass(srcContext, fileMeta, node as ts.ClassDeclaration);

        default:
          return ts.visitEachChild(node, (node) => {
            return visit(srcContext, fileMeta, node);
          }, transformContext);
      }
    }


    return (tsSourceFile) => {
      const srcContext: SourceContext = {
        cmpClassCount: 0
      };

      const fileMeta = ctx.files.get(tsSourceFile.fileName);
      if (fileMeta && fileMeta.hasCmpClass) {
        return visit(srcContext, fileMeta, tsSourceFile) as ts.SourceFile;
      }

      return tsSourceFile;
    };
  };

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

  if (!cmpMeta.tag || cmpMeta.tag.trim() === '') {
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

  if (cmpMeta.tag.indexOf(' ') > -1) {
    throw `"${cmpMeta.tag}" tag cannot contain a space`;
  }

  if (cmpMeta.tag.indexOf(',') > -1) {
    throw `"${cmpMeta.tag}" tag cannot be use for multiple tags`;
  }

  let invalidChars = cmpMeta.tag.replace(/\w|-/g, '');
  if (invalidChars !== '') {
    throw `"${cmpMeta.tag}" tag contains invalid characters: ${invalidChars}`;
  }

  if (cmpMeta.tag.indexOf('-') === -1) {
    throw `"${cmpMeta.tag}" tag must contain a dash (-) to work as a valid web component`;
  }

  if (cmpMeta.tag.indexOf('--') > -1) {
    throw `"${cmpMeta.tag}" tag cannot contain multiple dashes (--) next to each other`;
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
      const modeName = styleModeName.trim().toLowerCase();
      cmpMeta.modes[modeName] = {
        styleUrls: [styleModes[styleModeName]]
      };
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


interface SourceContext {
  cmpClassCount: number;
}

const PASSIVE_TRUE_DEFAULTS = [
  'dragstart', 'drag', 'dragend', 'dragenter', 'dragover', 'dragleave', 'drop',
  'mouseenter', 'mouseover', 'mousemove', 'mousedown', 'mouseup', 'mouseleave', 'mouseout', 'mousewheel',
  'pointerover', 'pointerenter', 'pointerdown', 'pointermove', 'pointerup', 'pointercancel', 'pointerout', 'pointerleave',
  'resize',
  'scroll',
  'touchstart', 'touchmove', 'touchend', 'touchenter', 'touchleave', 'touchcancel',
  'wheel',
];
