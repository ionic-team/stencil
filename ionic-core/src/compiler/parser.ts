import { CompileOptions, CompilerContext, ComponentItem} from './interfaces';


export function parseComponentDecorator(content: string, opts?: CompileOptions, ctx?: CompilerContext) {
  const items: ComponentItem[] = [];

  if (!content || typeof content !== 'string' || !content.length) {
    return items;
  }

  var match: TemplateUrlMatch;

  while ((match = getTemplateMatch(content))) {
    items.push({
      hasValidComponent: true,
      template: content,
      templateUrl: match.templateUrl,
      inputComponentDecorator: match.component
    });

    content = content.replace(match.component, '');
  }


  return items;
}


export function getTemplateMatch(str: string): TemplateUrlMatch {
  const match = COMPONENT_REGEX.exec(str);
  if (match) {
    return {
      start: match.index,
      end: match.index + match[0].length,
      component: match[0],
      templateProperty: match[3],
      templateUrl: match[5].trim()
    };
  }
  return null;
}


export interface TemplateUrlMatch {
  start: number;
  end: number;
  component: string;
  templateProperty: string;
  templateUrl: string;
}


export interface ComponentMeta {
  selector?: string;
  templateUrl?: string;
  template?: string;
}


const COMPONENT_REGEX = /\@Component\s*?\(\s*?(\{([\s\S]*?)(\s*templateUrl\s*:\s*(['"`])(.*?)(['"`])\s*?)([\s\S]*?)}\s*?)\)/m;
